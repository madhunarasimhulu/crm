import { setCard, showToast } from 'actions';
import { Customers, Wallet } from 'clients';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Loader, ActionButton } from '../../../components/commons';
import FrmBlockModal from '../FrmBlockModal';
import RenderIf from 'components/RenderIf';
import { modules } from 'utils/coral/Modules';
export default function FrmBlock({ card, updateFrmStatus, role }) {
  const [isLoading, setLoading] = React.useState(false);
  const [frmStatus, setFrmStatus] = React.useState(null);
  const [customFields, setCustomFields] = React.useState(null);
  const [isOpen, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  let showMessage = (message, style = 'error') =>
    dispatch(
      showToast({
        message,
        style,
      }),
    );

  React.useEffect(() => {
    setLoading(true);
    Customers.getAccountStatus(card?.account?.id)
      .then(({ data }) => {
        let { custom_fields } = data ?? {};
        // Verify the custom_fields
        validateCustomFields(custom_fields);
        setLoading(false);
      })
      .catch((e) => {
        showMessage('Unable to fetch the Account Details');
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    updateFrmStatus(!!frmStatus ? frmStatus : 'N');
  }, [frmStatus]);

  const validateCustomFields = (custom_fields) => {
    if (!custom_fields) {
      custom_fields = JSON.stringify({ frm_block: [] });
    }
    // Parsing the custom_fields
    try {
      custom_fields = JSON.parse(custom_fields);
    } catch (error) {
      custom_fields = null;
    }
    if (!custom_fields || !Array.isArray(custom_fields?.frm_block)) {
      custom_fields = custom_fields || {};
      custom_fields = { ...custom_fields, frm_block: [] };
    } // Initially if there is no custom_fields.frm_block iam setting it to 'N's
    setFrmStatus(custom_fields?.frm_block?.includes(card?.id) ? 'Y' : 'N');
    setCustomFields(custom_fields ?? {});
  };

  const handleFrmStatus = async (e) => {
    e.preventDefault();
    if (!frmStatus) return showMessage('Unable to get the Account Status');
    setLoading(true);
    if (card?.status === 'BLOCKED' && frmStatus === 'N') {
      // if Card is in Blocked Status & frmStatus is N then only update the custom_fields and showing the message
      showMessage('Card is already in Blocked Stage', 'success');
    } else {
      let cardResp = await UpdateCard();
      if (!cardResp) {
        setOpen(false);
        setLoading(false);
        return;
      }
    }
    let customFieldsResp = await updateCustomFields();
    if (!customFieldsResp) {
      setOpen(false);
      setLoading(false);
      return;
    }
    setOpen(false);
    setLoading(false);
    setFrmStatus((prev) => (prev === 'N' ? 'Y' : 'N'));
    showMessage(
      `FRM ${frmStatus === 'N' ? 'Block' : 'Unblock'} Successfully Updated`,
      'success',
    );
  };

  const UpdateCard = async () => {
    // Logic: Blocking the card using temporary block API & also updating custom_files frm_block: Y using custom_files update API
    let status = String(frmStatus).toUpperCase() === 'N' ? 'BLOCKED' : 'NORMAL';
    let cardResp = await Wallet.changeStatus(
      card?.customer?.id,
      card?.account?.id,
      card?.id,
      status,
    )
      .then((_) => {
        //Update the Card Status in redux store
        dispatch(
          setCard({
            ...card,
            status,
          }),
        );
        return true;
      })
      .catch((e) =>
        showMessage(
          `Unable to ${frmStatus === 'N' ? 'Block' : 'Unblock'} the Card`,
        ),
      );
    //Update the Card Status in redux store have to do

    return !!cardResp;
  };

  const updateCustomFields = async () => {
    let frm_block = [...customFields?.frm_block];
    // Updating frm_block array
    // Logic : if frmStatus is N then adding card id to frm_block, otherwise removing the cardid from frm_block array so that we can assume if card id is not present in frm_block array that card is unblock stage according to frm system
    if (String(frmStatus).toUpperCase() === 'N') frm_block.push(card?.id);
    else {
      let findIndex = frm_block.findIndex(
        (x) => Number(x) === Number(card?.id),
      );
      if (findIndex < 0) return;
      frm_block.splice(findIndex, 1);
    }
    //
    let updatedCustomFields = { ...customFields, frm_block };
    let resp = await Customers.updateCustomFields(
      card?.account?.id,
      updatedCustomFields,
    ).catch((e) => {
      showMessage(`Unable to update the FRM Status, but Card Status Updated`);
      return null;
    });
    if (!!resp) setCustomFields({ ...updatedCustomFields });
    return !!resp;
  };

  return (
    <RenderIf render={modules.FRM_BLOCK.roles.includes(role)}>
      <FrmBlockModal
        card={card}
        onSubmit={handleFrmStatus}
        isOpen={isOpen}
        isSubmitting={isLoading}
        frm_block={frmStatus}
        handleModalClose={() => {
          setOpen(false);
        }}
      />
      <ActionButton isLoading={isLoading} onClick={() => setOpen(true)}>
        {isLoading || !frmStatus ? (
          <Loader />
        ) : String(frmStatus).toUpperCase() === 'N' ? (
          <FormattedMessage id={'cards.frmBlock'} />
        ) : (
          <FormattedMessage id={'cards.frmUnBlock'} />
        )}
      </ActionButton>
    </RenderIf>
  );
}

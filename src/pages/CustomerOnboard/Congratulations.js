import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import RenderIf from 'components/commons/RenderIf';
import { onBoardingConfig as boardingConfig } from 'utils/onBoarding/OnboardingConfig';

export const CongratulationsPage = ({
  limit,
  handleConfirm,
  isOtpBtnDisabled,
  onBoardingConfig,
}) => {
  const [isAgreeTandC, setIsAgreeTandC] = useState(false);
  const [isTandCalert, setIsTandCalert] = useState(false);

  const handleConfirmRequest = () => {
    isAgreeTandC ? handleConfirm() : setIsTandCalert(true);
  };
  const handleTandCalert = () => {
    isAgreeTandC ? setIsTandCalert(true) : setIsTandCalert(false);
  };
  const handleCheckbox = async () => {
    await handleTandCalert();
    setIsAgreeTandC((prev) => !prev);
  };

  const OpenExternal = ({ name, url }) => {
    const handleClick = () => {
      window.open(url, '_blank');
    };
    return (
      <span className="onboard-page-TandC" onClick={handleClick}>
        {name}
      </span>
    );
  };

  return (
    <section className="onboard-content">
      <div className="onboard-page-title">
        <FormattedMessage id={`Congratulations!`} />
      </div>
      <div className="onboard-review-text">
        <p>{`Dear Customer,`}</p>
        <p>
          {String(onBoardingConfig?.welcome_message).replace(
            '{{LIMIT}}',
            limit,
          )}
        </p>
      </div>

      <div>
        <div className="onboard-page-TandC-container">
          <input
            type="checkbox"
            checked={isAgreeTandC}
            onChange={handleCheckbox}
            className="onboard-page-TandC-checkbox"
          />
          <p>
            I agree to the{' '}
            <OpenExternal
              name="Terms and Conditions"
              url={onBoardingConfig?.terms_conditions_pdf_url}
            />
            <RenderIf
              render={onBoardingConfig?.code === boardingConfig.CL_00UTKB.code}
            >
              {', '}
              <OpenExternal
                name="Card member agreement"
                url={onBoardingConfig?.card_member_agreement_url}
              />
              {' and '}
              <br />
              <OpenExternal
                name="Key fact statement"
                url={onBoardingConfig?.key_fact_statement_url}
              />{' '}
            </RenderIf>{' '}
            of the Credit Card Application.
          </p>
        </div>
        <div>
          <label className="onboard-page-TandC-error-msg">
            {isTandCalert ? (
              <>
                <BsFillExclamationCircleFill />
                <span>Please agree to the Terms and Conditions to Proceed</span>
              </>
            ) : null}
          </label>
        </div>
      </div>

      <div className="onboard-btn-container">
        {/* <button
          type="button"
          className={
            isOtpBtnDisabled
              ? 'onboard-page-button-disabled'
              : 'onboard-page-button'
          }
          disabled={isOtpBtnDisabled}
          onClick={handleConfirmRequest}
        >
          <FormattedMessage id={`Confirm Request`} />
        </button> */}
      </div>

      <div className="onboard-page-img-container">
        <img
          src={onBoardingConfig?.logo?.default}
          alt="banner-img"
          className="onboard-banner-img"
        />
      </div>
    </section>
  );
};

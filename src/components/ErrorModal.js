import React from 'react';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';
import errorIcon from '../assets/feedback/error.svg';

const Wrapper = styled.div`
  transition: all 0.15s ease-in-out;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 1;
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  left: 0;
  top: 0;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  position: relative;
  border: 1px solid #d7dae0;
  border-radius: 25px;
  overflow: hidden;
  background-color: #fafafa;
  color: #202832;
  @media screen and (min-width: 30em) {
    margin-right: auto;
    margin-left: auto;
    max-width: 32rem;
  }
`;

const ModalContent = styled.div`
  border-top: 1px solid #d7dae0;
  border-bottom: 1px solid #d7dae0;
  font-size: 0.875rem;
  text-align: center;
  padding: 2rem;
  font-weight: 100;
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: row;
`;

const BaseButton = styled.button`
  border-radius: 0;
  border-style: none;
  border-width: 0;
  background-color: transparent;
  color: #2c3644;
  font-size: 0.875rem;
  text-transform: uppercase;
  padding: 1rem;
  width: 100%;
  font-weight: 400;
  text-align: center;
  display: block;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`;
const Title = styled.h1`
  text-align: center;
  font-weight: 700;
  line-height: 1.5;
  color: #2c3644;
  font-size: 21px;
  margin-bottom: 10px;
`;
const Description = styled.p`
  font-weight: 400;
  color: #2c3644;
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 16px;
`;

const Icon = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
`;

const ErrorModalComponent = ({ onClick, intl, message = '', ...props }) => {
  const translate = (id) => intl.formatMessage({ id });

  const fadeInStates = {
    entering: 'o-0',
    entered: 'o-100',
    exiting: 'o-100',
    exited: 'o-0',
  };

  const growStates = {
    entering: 0.2,
    entered: 1,
    exiting: 1,
    exited: 0,
  };

  return (
    <Transition timeout={50} appear in>
      {(state) => (
        <Wrapper
          data-testid={props['data-testid']}
          className={`${fadeInStates[state]}`}
        >
          <Modal style={{ transform: `scale(${growStates[state]})` }}>
            <ModalContent>
              <Title>{translate('errorModal.title')}</Title>
              <Description>
                {translate('errorModal.description')}
                {message}
              </Description>
              <Icon src={errorIcon} />
            </ModalContent>
            <ModalActions>
              <BaseButton
                data-testid={`${props['data-testid']}.okButton`}
                type="button"
                onClick={onClick}
              >
                {translate('errorModal.okButton')}
              </BaseButton>
            </ModalActions>
          </Modal>
        </Wrapper>
      )}
    </Transition>
  );
};

const mapStateToProps = ({ intl }, props) => ({
  intl,
  ...props,
});

export const ErrorModal = connect(mapStateToProps)(
  injectIntl(ErrorModalComponent),
);

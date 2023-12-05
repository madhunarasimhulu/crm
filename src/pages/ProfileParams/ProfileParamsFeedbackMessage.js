import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Button } from '../../components/commons';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  background-color: #fff;
  padding: 20px 10px;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  color: ${(props) => (props.rejected ? '#f44336' : '#25c33a')};
  text-align: center;
`;
const Message = styled.p`
  font-size: 1.2rem;
  text-align: center;
  line-height: 1.3;
  font-weight: 100;
  color: #768092;
`;

export const ProfileParamsFeedbackMessage = ({ rejected = false }) => (
  <Wrapper>
    <MessageWrapper>
      <Title rejected={rejected}>
        <FormattedMessage
          id={`profile.changeStatus.${rejected ? 'rejected' : 'success'}Title`}
        />
      </Title>
      <Message>
        <FormattedMessage
          id={`profile.changeStatus.${
            rejected ? 'rejected' : 'success'
          }Message`}
        />
      </Message>
    </MessageWrapper>
    <Button
      text={<FormattedMessage id="back" />}
      type="button"
      className="button button--back"
      onClick={() => window.history.go(-1)}
    />
  </Wrapper>
);

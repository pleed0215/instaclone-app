import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput } from "react-native";
import { LoggedOutStackParamList } from "../../routers/navs";
import styled from "styled-components/native";
import { AuthLayout } from "../../components/AuthLayout";
import { ButtonInactivable } from "../../components/ButtonInactivable";
import { useForm } from "react-hook-form";
import { ControlledInput } from "../../components/ControlledInput";
import { EMAIL_REGEX } from "../../util";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import {
  MutationLogin,
  MutationLoginVariables,
} from "../../codegen/MutationLogin";
import {
  MutationCreateAccount,
  MutationCreateAccountVariables,
} from "../../codegen/MutationCreateAccount";
import { makeLogin } from "../../apollo/client";

const GQL_CREATE_ACCOUNT = gql`
  mutation MutationCreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

const GQL_LOGIN = gql`
  mutation MutationLogin($input: LoginInput!) {
    login(input: $input) {
      ok
      token
      error
    }
  }
`;

type AuthPageProp = StackScreenProps<LoggedOutStackParamList, "Auth">;
type FormProp = {
  email: string;
  username: string;
  password: string;
  password2: string;
  firstName: string;
};

const ErrorContainer = styled.View`
  margin-bottom: 10px;
  margin-top: 10px;
  width: 100%;
`;

const ErrorText = styled.Text`
  color: ${(props) => props.theme.color.error};
  width: 100%;
  text-align: center;
`;

export const AuthPage: React.FC<AuthPageProp> = ({ navigation, route }) => {
  const {
    params: { isCreating },
  } = route;
  const usernameRef = useRef<TextInput>(null),
    emailRef = useRef<TextInput>(null),
    firstNameRef = useRef<TextInput>(null),
    passwordRef = useRef<TextInput>(null),
    password2Ref = useRef<TextInput>(null);
  const {
    control,
    getValues,
    formState,
    errors,
    handleSubmit,
    reset,
  } = useForm<FormProp>({
    mode: "onChange",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      firstName: "",
      password2: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [login] = useMutation<MutationLogin, MutationLoginVariables>(
    GQL_LOGIN,
    {
      onCompleted: async (data: MutationLogin) => {
        setLoading(false);
        if (data.login.ok && data.login.token) {
          await makeLogin(data.login.token);
        } else {
          setError(`????????? ??????: ${data.login.error}`);
        }
      },
    }
  );
  const [createAccount] = useMutation<
    MutationCreateAccount,
    MutationCreateAccountVariables
  >(GQL_CREATE_ACCOUNT, {
    onCompleted: (data: MutationCreateAccount) => {
      setLoading(false);
      if (data.createAccount.ok) {
        alert("????????? ??????????????????. ????????? ????????????.");
        navigation.navigate("Auth", { isCreating: false });
      } else {
        setError(`?????? ?????? ??????: ${data.createAccount.error}`);
      }
    },
  });

  const onNext = (nextRef: React.RefObject<TextInput>) => () => {
    nextRef?.current?.focus();
  };
  const onValid = () => {
    const { username, email, password, firstName } = getValues();
    setLoading(true);
    if (isCreating) {
      createAccount({
        variables: {
          input: {
            username,
            email,
            password,
            firstName,
          },
        },
      });
    } else {
      login({
        variables: {
          input: {
            username,
            password,
          },
        },
      });
    }
  };

  return (
    <AuthLayout>
      {isCreating && (
        <ControlledInput
          name="email"
          inputRef={emailRef}
          autoCapitalize="none"
          control={control}
          placeholder="????????? ??????"
          keyboardType="email-address"
          rules={{
            required: {
              value: true,
              message: "????????? ????????? ??????????????????",
            },
            pattern: {
              value: EMAIL_REGEX,
              message: "????????? ????????? ?????? ???????????????.",
            },
          }}
          returnKeyType="next"
          autoCorrect={false}
          onSubmitEditing={onNext(usernameRef)}
          isError={Boolean(errors.email)}
        />
      )}
      <ControlledInput
        inputRef={usernameRef}
        name="username"
        autoCapitalize="none"
        control={control}
        placeholder="????????? ??????"
        rules={{
          minLength: {
            value: 5,
            message: "????????? ??????: 5-18?????? ????????? ????????? ????????????.",
          },
          maxLength: {
            value: 18,
            message: "????????? ??????: 5-18?????? ????????? ????????? ????????????.",
          },
          required: {
            value: true,
            message: "????????? ????????? ?????????????????????.",
          },
        }}
        onSubmitEditing={onNext(isCreating ? firstNameRef : passwordRef)}
        returnKeyType="next"
        autoCorrect={false}
        isError={Boolean(errors.username)}
      />

      {isCreating && (
        <ControlledInput
          inputRef={firstNameRef}
          name="firstName"
          autoCapitalize="sentences"
          control={control}
          placeholder="??????"
          rules={{
            minLength: {
              value: 2,
              message: "??????: 2-18?????? ????????? ????????? ????????????.",
            },
            maxLength: {
              value: 18,
              message: "??????: 2-18?????? ????????? ????????? ????????????.",
            },
            required: {
              value: true,
              message: "????????? ?????????????????????.",
            },
          }}
          autoCorrect={false}
          returnKeyType="next"
          isError={Boolean(errors.firstName)}
          onSubmitEditing={onNext(passwordRef)}
        />
      )}
      <ControlledInput
        inputRef={passwordRef}
        name="password"
        autoCapitalize="none"
        secureTextEntry
        control={control}
        placeholder="????????????"
        keyboardType="ascii-capable"
        rules={{
          minLength: {
            value: 8,
            message: "??????: 8-18?????? ????????? ????????? ????????????.",
          },
          maxLength: {
            value: 18,
            message: "??????: 8-18?????? ????????? ????????? ????????????.",
          },
          required: {
            value: true,
            message: "????????? ?????????????????????.",
          },
        }}
        returnKeyType={isCreating ? "next" : "go"}
        isError={Boolean(errors.password)}
        onSubmitEditing={onNext(password2Ref)}
      />

      {isCreating && (
        <ControlledInput
          inputRef={password2Ref}
          name="password2"
          autoCapitalize="none"
          secureTextEntry
          control={control}
          placeholder="???????????? ??????"
          keyboardType="ascii-capable"
          rules={{
            minLength: {
              value: 8,
              message: "????????????: 8-18?????? ????????? ????????? ????????????.",
            },
            maxLength: {
              value: 18,
              message: "????????????:8-18?????? ????????? ????????? ????????????.",
            },
            required: {
              value: true,
              message: "??????????????? ?????? ???????????????.",
            },
            validate: {
              value: (value) =>
                value === getValues("password") ||
                "??????????????? ???????????? ????????????",
            },
          }}
          returnKeyType={isCreating ? "join" : undefined}
          isError={Boolean(errors.password2)}
          blurOnSubmit={false}
          onSubmitEditing={handleSubmit(onValid)}
        />
      )}
      <ErrorContainer>
        {Object.keys(errors).map((error, index) => (
          <ErrorText key={index}>
            {Object.values(errors)[index]?.message}
          </ErrorText>
        ))}
        {error !== "" && <ErrorText>{error}</ErrorText>}
      </ErrorContainer>
      <ButtonInactivable
        fullWidth
        disabled={!formState.isValid}
        onPress={handleSubmit(onValid)}
        text={isCreating ? "??????" : "?????????"}
        loading={loading}
      />
    </AuthLayout>
  );
};

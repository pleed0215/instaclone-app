# Instaclone app

## 1. AppLoading

### issue

1. AppLoading에서 걸림.

- startAsync 파트에서 typescript 문제.
  공식문서에서는 startAsync의 callback 함수가 return Promise.all 형태인데... typescript에서는 type error가 발생한다.

  https://github.com/expo/expo/issues/8062

  이 링크를 참고해보면, 굳이 return을 안해도 되고 await로 해도 된다고 하는데... 그런가.. asset들을 리턴을 안해주는 건데.. 괜찮은건가...
  아직 작동 방식을 잘 모르겠어서 일단 하라는대로 해야겠다.

2. React navigation

- [문서링크](https://reactnavigation.org/docs/getting-started)
- Stack navigiation 사용하려면 따로 인스톨 해줘야 함.

  https://reactnavigation.org/docs/stack-navigator/

  ```tsx
    const Stack = createStackNavigation();

    ...

    <NavigationContainer>
      <Stack.Navigation>
        <Stack.Screen name="blahblah" component={WelcomePage} />
          ...
  ```

  이런식으로 사용하는 구조임.

  - Screen에서 사용하는 component에는 navigation과 route라는 props가 자동으로 들어간다.

    <code>console.log(props)</code> 해보면 알 수 있음.

  - Stack + Typescript setting 참고할 링크

    https://reactnavigation.org/docs/typescript/

3. react-native-appearance

expo install react-native-appearance

https://docs.expo.io/versions/latest/sdk/appearance/

4. react hook form

text input에서 strong password behavior 나오는 것 없애는 방법

https://stackoverflow.com/questions/59038086/react-native-securetextentry-disable-ios-13-strong-password-behavior

ngrok 개굿.. 진작 알았으면.. ㅠㅠ

로컬에서 할 거면 localtunnel을 이용해도 괜찮을 것같다. 근데 나는 싫엉.. local에서 하기 싫엉.

5. react native directory
   react native 관련 패키지들을 다운 받을 수 있는 허브.
   react native에서 지원하는 기본 async storage가 폐기 되었으므로,, 다른 대안을 찾아야 한다면서 들어온 곳..
   expo에서도 검색할 수 있다.
   expo에서 async storage를 검색하면 나온다.

web에서 했던 방식대로 storage를 조작하기 어려우므로..(storag가 async라 makeVar에 기본값을 할당하기 어렵네..)
asset을 load하는 곳에서 token도 읽어오도록 하자.

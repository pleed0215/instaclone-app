# Instaclone app

home,search, photo, like/heart, profile

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

6. StackNavFactory

- 인스타그램 스크린들을 분석하면서..
- 봐라.. 탭 네비게이션이 밑에 있지만, 요기 사진을 누르면 스택 네비게이션으로 작동하지 하믄서.. 보여준..
- 탭 네비게이션 안에 스택 네비게이션을 넣어야 되는데, 자꾸 만들기 힘드니까 StackNavigationFactory를 만들자라는 취지.
- 내용 자체는 어렵지 않은데, typescript 적용을 해야해서..몇가지 고민이 좀 들긴했음.

```tsx
<LoggedInNav.Screen
  name="Me"
  options={{
    tabBarIcon: ({ focused, color, size }) => (
      <Ionicons
        name={focused ? "person" : "person-outline"}
        color={color}
        size={focused ? size + 4 : size}
      />
    ),
  }}
>
  {/* 이 부분이 적응이 잘 안됨 */}
  {() => <StackNavFactory screenName="Me" />}
</LoggedInNav.Screen>
```

이런 형태의 코드는 좀.. 잘 적응되지 않는다..

7. TouchableOpacity가 text 길이 fit 되는 사이즈를 갖게 하려면..
   width: auto 이런거 안됨.

   https://stackoverflow.com/questions/61829929/react-native-how-to-make-touchableopacity-shrink-to-fit-text-contents

```tsx
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  ...
  align-self: flex-start;
`;
```

alignSelf: 'flex-start' 옵션을 주면 된다. 위 코드는 styled components를 이용한 코드라 형태가 약간 다르다.

- refrehsing & onRefreshing..
  요즘 앱들 보면 스크린을 맨 위에서 당기는 제스쳐에 리프레쉬 되는 것들을 많이 보는데..
  그런 역할을 해주는 것이다.
  ScreenLayout 컨테이너는 loading이면 loading screen 아니면 children을 렌더링 해주는 컴포넌트이다.
  역시 다른 사람들의 코드를 잘 봐야하는 것.. 도움이 된다.

```tsx
<ScreenLayout loading={loading}>
  <FlatList
    refreshing={refreshing}
    onRefresh={() => setRefreshing(true)}
    data={data?.seeFeeds.feeds}
    keyExtractor={(item: QuerySeeFeeds_seeFeeds_feeds) => `${item.id}`}
    showsVerticalScrollIndicator={false}
    renderItem={renderPhoto}
  />
</ScreenLayout>
```

## fetchMore

와.. 이런게 있었네..
fetchMore를 하면 바로 적용이 안되는 것을 알 수 있는데, cache 때문에 그렇다.
fetch된 데이터는 cache에 저장이 되도록 되어 있는데, fetchMore를 하면 cache가 혼란?(자세한 이유는 검색을 아직 안해서 모르겠다)
을 겪기 때문에 수동으로 fetchMore된 data를 merging해야 한다.

merging는 client에서 설정을 해줘야 하는데..

```ts
typePolicies: {
      Query: {
        fields: {
          seeFeeds: {
            keyArgs: false,
            merge(
              exisiting: QuerySeeFeeds_seeFeeds,
              incoming: QuerySeeFeeds_seeFeeds
            ) {
              if (incoming.ok && incoming.feeds) {
                if (exisiting) {
                  return exisiting.feeds
                    ? {
                        ...exisiting,
                        feeds: [...exisiting.feeds, ...incoming.feeds],
                      }
                    : { ...exisiting, feeds: [...incoming.feeds] };
                } else {
                  return incoming;
                }
              }
            },
          },
        },
      },
```

니코는 간단하고 했지만 사실 니코와 다르게 코딩을 했기 때문에 위와 같이 코드가 좀 복잡해졌다. null이나 undefined를 걸러야 하기 때문에..
pagination도 문제인게.. 마지막 페이지면...?? 더이상 fetching을 하면 안되는데...라는 문제도 있다.
유틸리티 함수인

```ts
  offsetLimitPagination이라는 것이 있는데...
  허허.. 나는 사용할 수 없는건가..
```

여태까지 배운 페이지네이션이 페이지기반만 배웠는데.. offset, limit pagination 개념을 조금 알아 놓으면 도움될 것 같다.
pagination에 더불어서 cache를 다루는 방법을 조금 더 알아야 되는 것이..cache의 merge에 대해 조금더... 알아야 한다..
아니그러면, 앱 동작이 재미없을 것 같다.

https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-merge-function

## apollo cache persist

다 좋다 이거야.
근데 갑자기 수정한 내용들이 반영이 안돼??
persisCache의 옵션 중 serialize: false로 해보자.

apollo 함수들 중에는 called라는 것도 있다.

FlatList에는 numColumns라는 것도 있다.

upload 파트와서 스크린구조가 바꼈다.
logged in navigation은 bottom tab nav였는데..
stack nav로 바꾸고, 첫 스크린을 tab nav로 바꾼다.
-> 카메라를 모달로 호출하려고 .. 더 큰 네비게이션을 만든 것.

```tsx
<LoggedInNav.Screen
  name="Camera"
  component={View}
  listeners={{ tabPress: () => alert("pressed") }}
  options={{
    tabBarIcon: ({ focused, color, size }) => (
      <Ionicons
        name={focused ? "camera" : "camera-outline"}
        color={color}
        size={focused ? size + 4 : size}
      />
    ),
  }}
/>
```

카메라쪽 스크린인데..listner는 event를 가지고 있다.
마치 웹 이벤트처럼 defaultPrevent를 가지고 있는데.. 우리는 현재 카메라가 있는 bottom tab navigation안에 있는 stack navigation에서 제일 바깥 쪽에 있는 upload 스크린을 모달창으로 띄어야 한다.
그래서 일시적으로 카메라를 눌렀을 때 나오는 페이지, 컴포넌트들이 나오게 막는 역할을 하는 것.

```tsx
listeners?: ScreenListeners<State, EventMap> | ((props: {
        route: RouteProp<ParamList, RouteName>;
        navigation: any;
    }) => ScreenListeners<State, EventMap>);
```

또한 listener를 보면 Screen Prop을 가지면서 screen listener를 리턴해주는 함수가 될 수도 있다.
그래서..

```tsx
listeners={({navigation})=> {
          return {
            tabPress: (e) => {
              e.preventDefault();
            },
          }
        }}
```

위 screen의 listener의 옵션은 이렇게 바뀔 수도 있다.
다만 위에 navigation의 정의된 부분을 보면 navigation이 any이다. 그래서 typescript가 사용될 수 있는 부분은 아쉽게도 아닌데.. 이해가 되긴한다.
네비게이션 간을 이동하려면 어쩔 수 없는 것인 것으로 생각된다.
그리고 stack의 mode를 modal로 해놓으면.. 옆으로 이동하는 card형태와는 다른 밑에서 올라오는 형태의 스크린을 볼 수 있다.

```tsx
<LoggedInWrapper.Navigator headerMode="none" mode="modal">
  <LoggedInWrapper.Screen name="LoggedIn" component={LoggedInNavigation} />
  <LoggedInWrapper.Screen name="Upload" component={UploadPage} />
</LoggedInWrapper.Navigator>
```

### Material Top Navigation

```tsx
<UploadTabNav.Navigator
      tabBarPosition="bottom"
      tabBarOptions={{
        style: {
          backgroundColor: theme.background.primary,
          height: 70,
          justifyContent: "flex-start",
        },
        activeTintColor: theme.color.link,
        inactiveTintColor: theme.color.primary,
        indicatorStyle: {
          backgroundColor: theme.color.link,
          marginBottom: 25,
        },
      }}
    >
```

```tsx
<UploadTabNav.Screen name="Select">
  {() => (
    <Stack.Navigator>
      <Stack.Screen name="Select" component={SelectPhotoPage} />
    </Stack.Navigator>
  )}
</UploadTabNav.Screen>
```

이런 형태는 정말.. 적응이 안되는 한편으로는.. 여기서 잘 배아 놔야 하는 것 같기도 하고..
이런식으로 스크린을 만들면 select photo에서 마음에 안들면 뒤로가기 해서 다시 원래 화면으로 갈 수도 있는 것이다.

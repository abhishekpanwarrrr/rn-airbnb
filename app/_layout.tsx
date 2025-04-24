import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "./global.css";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ModalHeaderText from "@/components/ModalHeaderText";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useAuth } from "@clerk/clerk-react";

// export const unstable_settings = {
//   initialRouteName: "(tabs)",
// };

SplashScreen.preventAutoHideAsync();

function InitialLayout({ isSignedIn }: { isSignedIn: boolean }) {
  // const [fontsLoaded, fontError] = useFonts({
  //   SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  //   ...FontAwesome.font,
  // });

  const router = useRouter();

  // if (!fontsLoaded) {
  //   return null;
  // }

  // useEffect(() => {
  //   if (fontsLoaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/(modals)/login");
    } else {
      router.push("/(tabs)/inbox");
    }
    SplashScreen.hideAsync();
  }, [isSignedIn]);
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/login"
        options={{
          presentation: "modal",
          title: "Log in or sign up",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modals)/booking"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerTransparent: true,
          headerTitle: (props) => <ModalHeaderText />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "#fff",
                borderColor: Colors.grey,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4,
              }}
            >
              <Ionicons name="close-outline" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="listing/[id]" options={{ headerTitle: "" }} />
    </Stack>
  );
}

function RootLayoutNav() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeInitialLayout />
    </ClerkProvider>
  );
}
export default RootLayoutNav;

function SafeInitialLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  console.log("isSignedIn, isLoaded", isSignedIn, isLoaded);

  if (!isLoaded) {
    return null;
  }

  return <InitialLayout isSignedIn={isSignedIn} />;
}

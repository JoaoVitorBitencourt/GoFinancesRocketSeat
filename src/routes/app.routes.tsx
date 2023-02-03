import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import { useTheme } from "styled-components";
import { MaterialIcons } from "@expo/vector-icons";

import { Dashboard } from "../screens/Dashboard";
import { Register } from "../screens/Register";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const theme = useTheme();

    return (
        <Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: theme.colors.secondary,
                tabBarInactiveTintColor: theme.colors.text,
                tabBarLabelPosition: 'beside-icon',
                tabBarStyle: {
                    height: 88,
                    paddingVertical: Platform.OS === 'ios'? 20 : 0
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
        
                    switch (route.name) {
                        case 'Listagem': iconName = "format-list-bulleted"; break;
                        case 'Cadastrar': iconName = "attach-money";break;
                        case 'Resumo': iconName = "pie-chart";break;
                    }
        
                    return <MaterialIcons 
                        name={iconName} 
                        size={size} 
                        color={color}
                    />;
                  }
            })}
        >
            <Screen 
                name="Listagem"
                component={Dashboard}
            />
            <Screen 
                name="Cadastrar"
                component={Register}
            />
            <Screen 
                name="Resumo"
                component={Register}
            />
        </Navigator>
    );
}
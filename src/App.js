import React from "react";
import { StackNavigator } from "react-navigation";

import HeroDetailsScreen from "./screens/HeroDetails";
import HeroesListScreen from "./screens/HeroesList";

const RootStack = StackNavigator({
  HeroesList: {
    screen: HeroesListScreen
  },
  HeroDetails: {
    screen: HeroDetailsScreen
  },
  initialRouteName: "HeroesList"
});

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

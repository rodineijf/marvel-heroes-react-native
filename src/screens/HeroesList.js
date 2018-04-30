import { Constants } from "expo";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Header, Icon, SearchBar } from "react-native-elements";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { MarvelService } from "../services/MarvelService";
import { myConstants } from "../utils/Utils";
import { HeroItemComponent } from "../components/HeroItem";

export default class HeroesListScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  offset = 0;
  search$ = new Subject();
  searchValue = "";

  constructor(props) {
    super(props);
    this.state = {
      heroesList: [],
      isFirstLoading: false,
      isLoadingInfinite: false,
      isSearching: false,
      isSearchLoading: false
    };
    this.limit = MarvelService.limit;
  }

  componentWillMount() {
    this.loadInitial();
    this.watchSearch();
  }

  cancelSearch() {
    this.searchValue = "";
    this.search$.next("");
    this.setState({
      isSearching: false
    });
  }

  doSearch(text) {
    this.searchValue = text;
    this.search$.next(text); // The text value is not used but is needed for distinctUntilChaged
  }

  async loadInitial() {
    this.setState({ isFirstLoading: true });
    const res = await MarvelService.fetchCharacters(this.offset);
    this.setState({
      heroesList: res,
      isFirstLoading: false
    });
  }

  watchSearch() {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => {
          this.offset = 0;
          this.setState({ isSearchLoading: true });
          return MarvelService.fetchCharacters(this.offset, this.searchValue);
        })
      )
      .subscribe(res => {
        this.setState({
          heroesList: res,
          isSearchLoading: false
        });
      });
  }

  async doInfinite() {
    this.offset = this.offset + this.limit;
    this.setState({
      isLoadingInfinite: true
    });
    const res = await MarvelService.fetchCharacters(
      this.offset,
      this.searchValue
    );
    this.setState({
      heroesList: [...this.state.heroesList, ...res],
      isLoadingInfinite: false
    });
  }

  render() {
    return this.state.isFirstLoading ? (
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: myConstants.colors.black,
          justifyContent: "center"
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <ImageBackground
        imageStyle={{ resizeMode: "cover" }}
        source={require("../../assets/background.png")}
        style={{
          backgroundColor: myConstants.colors.black,
          width: "100%",
          height: "100%"
        }}
      >
        {this.state.isSearching ? (
          <SearchBar
            containerStyle={{
              backgroundColor: myConstants.colors.redMarvel,
              marginTop: Constants.statusBarHeight
            }}
            inputStyle={{ color: myConstants.colors.white }}
            onCancel={() => this.cancelSearch()}
            onChangeText={text => this.doSearch(text)}
            placeholder="Search..."
            platform="android"
            ref={searchBar => (this.searchBar = searchBar)}
            showLoading={this.state.isSearchLoading}
          />
        ) : (
          <Header
            innerContainerStyles={{ padding: 0 }}
            outerContainerStyles={{
              backgroundColor: myConstants.colors.redMarvel,
              borderBottomWidth: 0,
              height: 56,
              marginTop: Constants.statusBarHeight
            }}
          >
            <Text
              style={{
                color: myConstants.colors.white,
                fontSize: 20,
                fontWeight: "500"
              }}
            >
              Marvel Heroes
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isSearching: true }, () => {
                  this.searchBar.focus();
                });
              }}
            >
              <Icon name="search" color={myConstants.colors.white} />
            </TouchableOpacity>
          </Header>
        )}
        <FlatList
          style={styles.container}
          ListHeaderComponent={() => (
            <Text
              style={{
                marginTop: 8,
                color: myConstants.colors.redMarvel,
                textAlign: "center"
              }}
            >
              Data provided by Marvel. © 2018 MARVEL
            </Text>
          )}
          ListFooterComponent={
            this.state.isLoadingInfinite ? (
              <ActivityIndicator style={{ paddingVertical: 16 }} />
            ) : null
          }
          data={this.state.heroesList}
          keyExtractor={item => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            this.state.heroesList ? this.doInfinite() : null;
          }}
          renderItem={hero => {
            return (
              <HeroItemComponent
                onPress={() => {
                  this.props.navigation.navigate("HeroDetails", {
                    hero: hero.item
                  });
                }}
                imageUri={`${hero.item.thumbnail.path}.${
                  hero.item.thumbnail.extension
                }`}
                name={hero.item.name}
              />
            );
          }}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

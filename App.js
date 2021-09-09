import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text, ActivityIndicator } from 'react-native';
import {Accordion, Box, Center, NativeBaseProvider, IconButton, Input} from "native-base";
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 1,
      isLoading: false
    }
  }
  componentDidMount() {
    this.setState({isLoading: true}, this.getData)
  }

  getData = async () => {
    const apiURL = `https://api.thecatapi.com/v1/breeds?limit=10&page=${this.state.page}`;

    fetch(apiURL, {
      headers: {"x-api-key": "DEMO-API-KEY"}
    }).then((res) => res.json())
      .then((resJson) => {
        this.setState({
          data: this.state.data.concat(resJson),
          isLoading: false
        })
      })
  }

  accordionComponent = ({item}) => {
    return (
      <Box>
        <Accordion>
          <Accordion.Item>
            <Accordion.Summary>
              <Text>{ item.name }</Text>
              <Accordion.Icon />
            </Accordion.Summary>
            <Accordion.Details>
              <Text>Country : {item.origin}</Text>
              <Text>{item.description}</Text>
              <Text>Temprament : {item.temperament}</Text>
            </Accordion.Details>
          </Accordion.Item>
        </Accordion>
      </Box>
    );
  }

  renderFooter = () => {
    return (
      this.state.isLoading ?
        <View style={styles.loader}>
          <ActivityIndicator size="large"/>
        </View> : null
    )
  }

  handleLoadMore = () => {
    console.log('load more called')
    this.setState({ page: this.state.page + 1, isLoading: true }, this.getData)
  }

  _onChangeSearchText(text) {

    console.log(text);

  }

  render() {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          
          <Input
            placeholder="Search..."
            variant="rounded"
            InputRightElement={
              <IconButton
                borderRadius="pill"
              />
            }
            onChangeText={this._onChangeSearchText.bind(this)}
          />
           
          <FlatList
            style={styles.container}
            data={this.state.data}
            renderItem={this.accordionComponent}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={1}
            ListFooterComponent={this.renderFooter}
          />
        </Center>
      </NativeBaseProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#f5fcff'
  },
  loader: {
    marginTop: 10,
    alignItems: 'center'
  }
})
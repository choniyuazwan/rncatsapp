import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text, ActivityIndicator } from 'react-native';
import {Accordion, Box, Center, NativeBaseProvider, IconButton, Input} from "native-base";
import axios from 'axios';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] = 'DEMO-API-KEY';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 1,
      isLoading: true,
      search: '',
      isSearch: false
    }
  }
  componentDidMount() {
    console.log('componentDidMount called')
    this.loadData();
  }

  loadData = () => {
    this.setState({isLoading: true})
    const { page, data, isSearch } = this.state;
    const url = `/breeds?limit=10&page=${page}`;
    !isSearch && axios
    // axios
      .get(url)
      .then((res) => {
        let result = res.data;
        this.setState({
          data: data.concat(result),
          page: page + 1,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  accordionComponent = ({item}) => {
    return (
      // <Box>
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
      // </Box>
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
  
  searchData = () => {
    this.setState({isLoading: true})
    axios.get(`/breeds/search?q=${this.state.search}`).then((res) => {
      let result = res.data;
      this.setState({ isSearch: true, data: result, isLoading: false });
    });
  };

  _onChangeSearchText(text) {
    this.setState(
      {
        search: text,
        page: 0,
      },
      () => {
        if (this.state.search && this.state.search.length > 0) {
          console.log('search data')
          this.searchData();
        } else {
          console.log('get data')
          this.loadData();
        }
        console.log('isi text', text);
        console.log('panjang text', this.state.search.length);
        console.log('panjang data', this.state.data.length);
      }
    );

  }

  render() {
    const {data} = this.state;
    return (
      <NativeBaseProvider>
        <Center>
          
          <Input
            placeholder="Search cat name here ..."
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
            data={data}
            renderItem={this.accordionComponent}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.loadData}
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
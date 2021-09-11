import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text, ActivityIndicator } from 'react-native';
import {Accordion, Center, NativeBaseProvider, IconButton, Input, Heading} from "native-base";
import axios from 'axios';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] = 'DEMO-API-KEY';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 0,
      search: '',
      isLoading: true,
      isSearch: false
    }
  }
  componentDidMount() {
    console.log('componentDidMount called')
    this.loadData();
  }

  loadData = async () => {
    await this.setState({isLoading: true})
    const { page, data, isSearch } = await this.state;
    const url = `/breeds?limit=10&page=${page}`;
    !isSearch && await axios
      .get(url)
      .then(async (res) => {
        let result = await res.data;
        await this.setState({
          data: data.concat(result),
          page: page + 1,
          isLoading: false
        });
        console.log('load data isi search', this.state.search);
        console.log('load data panjang search', this.state.search.length);
        console.log('load data panjang data', this.state.data.length);
        console.log('load data isSearch', this.state.isSearch);
        console.log('load data isLoading', this.state.isLoading);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  searchData = async () => {
    await this.setState({isLoading: true})
    await axios.get(`/breeds/search?q=${this.state.search}`).then(async (res) => {
      let result = await res.data;
      await this.setState({data: result, isLoading: false});
      console.log('search data isi search', this.state.search);
      console.log('search data panjang search', this.state.search.length);
      console.log('search data panjang data', this.state.data.length);
      console.log('search data isSearch', this.state.isSearch);
      console.log('search data isLoading', this.state.isLoading);
    }).catch((error) => {
      console.error(error);
    });
  };

  async _onChangeSearchText(text) {
    console.log('_onChangeSearchText called')
    this.setState(
      {
        search: text,
        page: 0,
        isSearch: true,
        data: [],
        isLoading: true
      },
      async () => {
        if (this.state.search && this.state.search.length > 0) {
          await this.searchData();
        } else {
          await this.setState({isSearch: false})
          await this.loadData();
        }
      }
    );
  }

  accordionComponent = ({item}) => {
    return (
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
  
  renderEmpty = () => {
    return (
      <View>
        <Text>Sorry data is not yet available</Text>
      </View>
    )
  }

  render() {
    const {data, isSearch, isLoading} = this.state;
    return (
      <NativeBaseProvider>
        <Center>
          <Heading size="md" style={{paddingVertical: 10}}>Cats Catalogue</Heading>
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
          
          {
            data.length === 0 && !isLoading ? 
              this.renderEmpty() :
              <FlatList
                style={styles.container}
                data={data}
                renderItem={this.accordionComponent}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={!isSearch && this.loadData}
                onEndReachedThreshold={1}
                ListFooterComponent={this.renderFooter}
              />   
          }
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
    paddingBottom: 80,
    alignItems: 'center'
  }
})
import { ToastContainer } from 'react-toastify';
import * as API from './services/api';

import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import css from './App.module.css';

export class App extends Component {
  state = {
    images: [],
    value: '',
    page: 1,
    isLoading: false,
    error: '',
    largeImageUrl: null,
  };
  setLargeImageUrl = images => {
    this.setState({ largeImageUrl: images });
  };

  hendleFormSubmit = value => {
    console.log(value);
    this.setState({
      value,
      page: 1,
      images: [],
    });
  };

  // addImages = async (value, page) => {
  //   console.log('add:', value);
  //   this.setState({ isLoading: true });
  //   try {
  //     const items = await API.fetchGallery(value, page);
  //     this.setState(prev => ({
  //       images: [...prev.images, ...items.hits],
  //       error: '',
  //     }));
  //     console.log(items, items.total);
  //   } catch {
  //     this.setState({ error: 'Error while loading data. Try again later' });
  //   } finally {
  //     this.setState({ isLoading: false });
  //   }
  // };
  async componentDidUpdate(_, prevState) {
    if (
      prevState.page !== this.state.page ||
      prevState.value !== this.state.value
    ) {
      // console.log('fetch.data');
      // console.log('add:', this.state.value);
      this.setState({ isLoading: true });
      try {
        const items = await API.fetchGallery(this.state.value, this.state.page);
        this.setState(prev => ({
          total: items.total,
          images: [...prev.images, ...items.hits],
          error: '',
        }));
        console.log(items, items.total);
      } catch {
        this.setState({ error: 'Error while loading data. Try again later' });
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }
  loadMore = async () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };
  render() {
    const { images } = this.state;
    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.hendleFormSubmit} />

        <ImageGallery images={images} onClick={this.setLargeImageUrl} />

        {this.state.isLoading ? (
          <Loader />
        ) : (
          <Button
            items={images}
            total={this.state.total}
            onClick={this.loadMore}
          />
        )}
        {this.state.largeImageUrl && (
          <Modal largeImageUrl={this.state.largeImageUrl} />
        )}

        <ToastContainer autoClose={2000} />
      </div>
    );
  }
}

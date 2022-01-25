import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'We could not find Recipes for that dish , please try another one';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultsView();

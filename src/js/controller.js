// import icons from '../img/icons.svg'; // Parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';

//importing data
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsViews.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import fracty from 'fracty';

// if (module.hot) module.hot.accept();
// let fraction = 50 / 100;

/**
 * Controls the recipes
 * @returns
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    //guard clauses

    if (!id) return;
    // console.log(id);
    recipeView.renderSpinner();

    //0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1.loading Recipe
    await model.loadRecipe(id);

    //2. Rendering recipe
    recipeView.render(model.state.recipe);
    //3) updating booksmarks view
    bookmarksView.update(model.state.bookmarks);
    // controlServings();
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    //1) get searchQuery
    const query = searchView.getQuery();

    if (!query) return;

    resultsView.renderSpinner();

    //2) Load search
    await model.loadSearchResults(query);

    //3) render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage(1));

    //4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings ()in state
  model.updateServings(newServings);

  //update the  recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// controlRecipes();

//better way

const controlAddBookmark = function () {
  //1) add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2) update view of bookmark icon
  recipeView.update(model.state.recipe);

  //3) render booksmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //rendering spinner
    addRecipeView.renderSpinner();
    //function to upload the new recipe
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //display success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // this goes back to the last page window.history.back();

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`${err} 💥💥`);
    addRecipeView.renderError(err.message);
  }
};

//PUBLISHER SUSCRIBER PATTERN

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

//old way
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

/* global document */

var searchId = 'LiBfqbJVcV';
var searchHash = '#' + searchId;
var searchContainerID = '#PkfLWpAbet';
var searchWrapperID = '#iCxFxjkHbP';
var searchCloseButtonID = '#VjLlGakifb';
var searchInputID = '#vpcKVYIppa';
var searchResultCID = '#fWwVHRuDuN';

function hideSearch() {
  var container = document.querySelector(searchContainerID);

  // eslint-disable-next-line no-undef
  if (window.location.hash === searchHash) {
    // eslint-disable-next-line no-undef
    history.go(-1);
  }

  // eslint-disable-next-line no-undef
  window.onhashchange = null;

  if (container) {
    container.style.display = 'none';
  }
}

function listenKey(event) {
  if (event.key === 'Escape') {
    hideSearch();
    // eslint-disable-next-line no-undef
    window.removeEventListener('keyup', listenKey);
  }
}

function showSearch() {
  try {
    // Closing mobile menu before opening
    // search box.
    // It is defined in core.js
    // eslint-disable-next-line no-undef
    hideMobileMenu();
  } catch (error) {
    console.error(error);
  }

  var container = document.querySelector(searchContainerID);
  var input = document.querySelector(searchInputID);

  // eslint-disable-next-line no-undef
  window.onhashchange = hideSearch;

  // eslint-disable-next-line no-undef
  if (window.location.hash !== searchHash) {
    // eslint-disable-next-line no-undef
    history.pushState(null, null, searchHash);
  }

  if (container) {
    container.style.display = 'flex';
    // eslint-disable-next-line no-undef
    window.addEventListener('keyup', listenKey);
  }

  if (input) {
    input.focus();
  }
}

async function fetchAllData() {
  // eslint-disable-next-line no-undef
  const url = new URL('data/search.json', baseURL);
  const result = await fetch(url);
  const { list } = await result.json();

  return list;
}

// eslint-disable-next-line no-unused-vars
function onClickSearchItem(event) {
  var target = event.currentTarget;

  if (target) {
    var href = target.getAttribute('href') || '';
    var id = href.split('#')[1] || '';
    var element = document.getElementById(id);

    if (!element) {
      id = decodeURI(id);
      element = document.getElementById(id);
    }

    if (element) {
      setTimeout(function() {
        // eslint-disable-next-line no-undef
        bringElementIntoView(element); // defined in core.js
      }, 100);
    }
  }
}

function buildSearchResult(result) {
  var output = '';

  for (const res of result) {
    var data = res.item;

    var link = res.item.link.replace('<a href="', '').replace(/">.*/, '');

    output += `

    <a onclick="onClickSearchItem(event)" href="${link}" class="search-result-item">
      <div class="search-result-item-title">
          ${data.title}
      </div>
      <div class="search-result-item-p">
          ${data.description ? data.description : 'No description available.'}
      </div>
    </a>
    `;
  }

  return output;
}

function getSearchResult(list, keys, searchKey) {
  var defaultOptions = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: keys
  };

  // var op = Object.assign({}, defaultOptions, options);
  var op = defaultOptions;

  // eslint-disable-next-line no-undef
  var searchIndex = Fuse.createIndex(op.keys, list);

  /* eslint-disable-next-line */
    var fuse = new Fuse(list, op, searchIndex);

  var result = fuse.search(searchKey);

  if (result.length > 20) {
    result = result.slice(0, 20);
  }

  return result;
}

function debounce(func, wait, immediate) {
  var timeout;

  return function() {
    // eslint-disable-next-line consistent-this, no-invalid-this
    var context = this,
      args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);
    if (immediate && !timeout) {
      func.apply(context, args);
    }
  };
}

let searchData;

async function search(event) {
  const value = event.target.value;
  const resultBox = document.querySelector(searchResultCID);
  const keys = ['title', 'description'];

  if (!resultBox) {
    console.error('Search result container not found');

    return;
  }

  if (!value) {
    resultBox.innerHTML = 'Type anything to view search result';

    return;
  }

  if (!searchData) {
    resultBox.innerHTML = 'Loading...';

    try {
      // eslint-disable-next-line require-atomic-updates
      searchData = await fetchAllData();
    } catch (e) {
      resultBox.innerHTML = 'Failed to load result.';

      return;
    }
  }

  const result = getSearchResult(searchData, keys, value);

  if (result.length === 0) {
    resultBox.innerHTML = 'No result found! Try some different combination.';

    return;
  }
  resultBox.innerHTML = buildSearchResult(result);
}

function onDomContentLoaded() {
  var input = document.querySelector(searchInputID);
  var searchButton = document.querySelectorAll('.search-button');
  var searchContainer = document.querySelector(searchContainerID);
  var searchWrapper = document.querySelector(searchWrapperID);
  var searchCloseButton = document.querySelector(searchCloseButtonID);

  var debouncedSearch = debounce(search, 300);

  if (searchCloseButton) {
    searchCloseButton.addEventListener('click', hideSearch);
  }

  if (searchButton) {
    searchButton.forEach(function(item) {
      item.addEventListener('click', showSearch);
    });
  }

  if (searchContainer) {
    searchContainer.addEventListener('click', hideSearch);
  }

  if (searchWrapper) {
    searchWrapper.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  }

  if (input) {
    input.addEventListener('keyup', debouncedSearch);
  }

  // eslint-disable-next-line no-undef
  if (window.location.hash === searchHash) {
    showSearch();
  }
}

// eslint-disable-next-line no-undef
window.addEventListener('DOMContentLoaded', onDomContentLoaded);

// eslint-disable-next-line no-undef
window.addEventListener('hashchange', function() {
  // eslint-disable-next-line no-undef
  if (window.location.hash === searchHash) {
    showSearch();
  }
});

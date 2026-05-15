document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
    const GRID = document.getElementById('halal-products-grid');
    const LOADER = document.getElementById('loader');
    const CATEGORY_FILTER = document.getElementById('category-filter');
    const SORT_FILTER = document.getElementById('sort-filter');
    const FILTER_BADGES = document.querySelectorAll('.filter-badge');
    const SEARCH_FORM = document.getElementById('search-form');
    const SEARCH_INPUT = document.getElementById('search-input');

    let state = {
        pageSize: 24,
        sortBy: 'unique_scans_n',
        category: '',
        labels: [],
        searchTerm: ''
    };

    async function fetchProducts() {
        LOADER.style.display = 'block';
        GRID.innerHTML = '';

        const params = new URLSearchParams({
            action: 'process',
            json: 1,
            page_size: state.pageSize,
            sort_by: state.sortBy,
            'fields': 'product_name,image_url,brands,code'
        });

        if (state.searchTerm) {
            params.append('search_terms', state.searchTerm);
        }

        let tagCount = 0;
        if (state.category) {
            params.append(`tagtype_${tagCount}`, 'categories');
            params.append(`tag_contains_${tagCount}`, 'contains');
            params   .append(`tag_${tagCount}`, state.category);
            tagCount++;
        }

        state.labels.forEach(label => {
            params.append(`tagtype_${tagCount}`, 'labels');
            params.append(`tag_contains_${tagCount}`, 'contains');
            params.append(`tag_${tagCount}`, label);
            tagCount++;
        });

        try {
            const response = await fetch(`${API_URL}?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayProducts(data.products);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            GRID.innerHTML = '<p>Error loading products. Please try again later.</p>';
        } finally {
            LOADER.style.display = 'none';
        }
    }

    function displayProducts(products) {
        if (!products || products.length === 0) {
            GRID.innerHTML = '<p>No products found matching your criteria.</p>';
            return;
        }

        products.forEach(product => {
            const productCardHTML = `
                <a href="product.html?code=${product.code}" class="halal-product-card-link">
                    <div class="halal-product-card">
                        <div class="product-image-container">
                            <img src="${product.image_url || 'https://via.placeholder.com/250'}" alt="${product.product_name || 'Product Image'}" loading="lazy">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${product.product_name || 'Unknown Product'}</h3>
                            <p class="product-brand">${product.brands || 'Unknown Brand'}</p>
                        </div>
                    </div>
                </a>
            `;
            GRID.insertAdjacentHTML('beforeend', productCardHTML);
        });
    }

    function setupEventListeners() {
        CATEGORY_FILTER.addEventListener('change', (e) => {
            state.category = e.target.value;
            fetchProducts();
        });

        SORT_FILTER.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            fetchProducts();
        });

        FILTER_BADGES.forEach(badge => {
            badge.addEventListener('click', () => {
                const filter = badge.dataset.filter;
                badge.classList.toggle('active');
                
                if (state.labels.includes(filter)) {
                    state.labels = state.labels.filter(l => l !== filter);
                } else {
                    state.labels.push(filter);
                }
                fetchProducts();
            });
        });

        SEARCH_FORM.addEventListener('submit', (e) => {
            e.preventDefault();
            state.searchTerm = SEARCH_INPUT.value;
            fetchProducts();
        });
    }

    // Initial Load
    setupEventListeners();
    fetchProducts();
});

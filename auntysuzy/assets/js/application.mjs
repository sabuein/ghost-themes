// Sample products data - duplicate and modify this object for each product
        const products = [
            {
                id: 1,
                title: "Artisan Coffee Blend",
                category: "food",
                image: "https://placehold.co/400x200",
                excerpt: "Premium organic coffee sourced from local farmers. Perfect for your morning routine.",
                link: "/product/1"
            },
            {
                id: 2,
                title: "Homemade Pasta Recipe Kit",
                category: "recipes",
                image: "https://placehold.co/400x200",
                excerpt: "Learn to make authentic Italian pasta from scratch with our complete recipe kit.",
                link: "/product/2"
            },
            {
                id: 3,
                title: "Hand-Woven Basket",
                category: "handicrafts",
                image: "https://placehold.co/400x200",
                excerpt: "Beautiful handcrafted basket made with sustainable materials by local artisans.",
                link: "/product/3"
            },
            {
                id: 4,
                title: "Abstract Canvas Print",
                category: "art",
                image: "https://placehold.co/400x200",
                excerpt: "Contemporary abstract artwork that brings modern elegance to any space.",
                link: "/product/4"
            },
            {
                id: 5,
                title: "Summer Festival Pass",
                category: "tickets",
                image: "https://placehold.co/400x200",
                excerpt: "Get your access to the biggest summer festival of the year with exclusive perks.",
                link: "/product/5"
            },
            {
                id: 6,
                title: "Gourmet Cheese Selection",
                category: "food",
                image: "https://placehold.co/400x200",
                excerpt: "Curated collection of artisan cheeses from around the world. Premium quality guaranteed.",
                link: "/product/6"
            }
        ];

        const grid = document.getElementById('productsGrid');
        const noResults = document.getElementById('noResults');
        const filterBtns = document.querySelectorAll('.filter-btn');
        let currentFilter = 'all';

        // Function to render products
        function renderProducts(filter) {
            grid.innerHTML = '';
            noResults.style.display = 'none';

            const filtered = filter === 'all' 
                ? products 
                : products.filter(p => p.category === filter);

            if (filtered.length === 0) {
                noResults.style.display = 'block';
                return;
            }

            filtered.forEach(product => {
                const card = document.createElement('article');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    <div class="product-content">
                        <span class="product-category">${product.category}</span>
                        <h2 class="product-title">${product.title}</h2>
                        <p class="product-excerpt">${product.excerpt}</p>
                        <a href="${product.link}" class="product-btn">Know More</a>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        // Event listeners for filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderProducts(currentFilter);
            });
        });

        // Initial render
        renderProducts('all');
import React, { useState, useEffect } from 'react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProductsFromAPI = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:3000/product/products');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let data = await response.json();
            data=data.products
            console.log("Fetched products:", data);
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on component mount
    useEffect(() => {
        fetchProductsFromAPI();
    }, []);

    return (
        <div>
            <h1>These are the products</h1>
            <button onClick={fetchProductsFromAPI} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh Products'}
            </button>
            
            {error && <p style={{color: 'red'}}>Error: {error}</p>}
            
             {loading ? (
                <p>Loading products...</p>
            ) : (
                <ul>
                    {products.map((product, index) => (
                        <li key={product?.id || `product-${index}`}>
                            <h2>{product?.name || "Unnamed Product"}</h2>
                            <p>Price: ${product?.saleprice || "N/A"}</p>
                            <p>Description: {product?.description || "No description available"}</p>
                            <p>Category: {product?.category || "Uncategorized"}</p>
                        </li>
                    ))}
                </ul>
            )} 
            
            {!loading && products.length === 0 && !error && (
                <p>No products found.</p>
            )}
        </div>
    );
};

export default Products;

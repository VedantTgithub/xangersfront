import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductList.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:1234';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  return (
    <div className="product-container">
      <h1>Product Management</h1>
      <div className="navigation-buttons">
        <Link to="/add-classifications" className="nav-button">Add Brand, Category, Subcategory</Link>
        <Link to="/add-product" className="nav-button">Add Product</Link>
      </div>
      <div className="table-section">
        <h2>Product List</h2>
        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Brand ID</th>
                <th>Category ID</th>
                <th>Subcategory ID</th>
                <th>Item Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.ProductID}>
                  <td>{product.ProductID}</td>
                  <td>{product.BrandID}</td>
                  <td>{product.CategoryID}</td>
                  <td>{product.SubCategoryID}</td>
                  <td>{product.ItemCode}</td>
                  <td className="action-buttons">
                    <Link to={`/edit-product/${product.ProductID}`} className="edit-btn">Edit</Link>
                    <button className="delete-btn" onClick={() => handleDelete(product.ProductID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

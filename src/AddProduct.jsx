import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:1234';

const AddProduct = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [countries, setCountries] = useState([]); // Added countries state
  const [formData, setFormData] = useState({
    BrandID: '',
    CategoryID: '',
    SubCategoryID: '',
    ItemCode: '',
    PartCode: '',
    ProductDescription: '',
    Warranty: '',
    MOQ: '',
    CountryID: '', // Added CountryID field
    Price: '' // Added Price field for Country_Product table
  });

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSubcategories();
    fetchCountries(); // Fetch countries when component mounts
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('/api/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/countries');
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', formData);
      alert('Product added successfully');
      setFormData({
        BrandID: '',
        CategoryID: '',
        SubCategoryID: '',
        ItemCode: '',
        PartCode: '',
        ProductDescription: '',
        Warranty: '',
        MOQ: '',
        CountryID: '', // Reset CountryID
        Price: '' // Reset Price
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Add New Product</h1>
      <div className="form-section product-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Brand:</label>
            <select name="BrandID" value={formData.BrandID} onChange={handleInputChange} required>
              <option value="">Select a brand</option>
              {brands.map(brand => (
                <option key={brand.BrandID} value={brand.BrandID}>{brand.BrandName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select name="CategoryID" value={formData.CategoryID} onChange={handleInputChange} required>
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.CategoryID} value={category.CategoryID}>{category.CategoryName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Subcategory:</label>
            <select name="SubCategoryID" value={formData.SubCategoryID} onChange={handleInputChange} required>
              <option value="">Select a subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory.SubCategoryID} value={subcategory.SubCategoryID}>{subcategory.SubCategoryName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Item Code:</label>
            <input type="text" name="ItemCode" value={formData.ItemCode} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Part Code:</label>
            <input type="text" name="PartCode" value={formData.PartCode} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Product Description:</label>
            <textarea name="ProductDescription" value={formData.ProductDescription} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Warranty (months):</label>
            <input type="number" name="Warranty" value={formData.Warranty} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>MOQ:</label>
            <input type="number" name="MOQ" value={formData.MOQ} onChange={handleInputChange} required />
          </div>

          {/* New Fields for Country Product */}
          <div className="form-group">
            <label>Country:</label>
            <select name="CountryID" value={formData.CountryID} onChange={handleInputChange} required>
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country.CountryID} value={country.CountryID}>{country.CountryName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input type="number" name="Price" value={formData.Price} onChange={handleInputChange} required />
          </div>

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

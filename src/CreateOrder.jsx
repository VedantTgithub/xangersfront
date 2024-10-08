import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import './CreateOrder.css';
import { Link, Navigate } from 'react-router-dom';

const CreateOrder = () => {
    const [distributorName, setDistributorName] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const [totalQty, setTotalQty] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
    const [products, setProducts] = useState([]);
    const [redirectToHome, setRedirectToHome] = useState(false);
    const [distributorCountry, setDistributorCountry] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const distributorId = localStorage.getItem('distributorId');
                if (!distributorId) {
                    throw new Error('Distributor ID not found');
                }

                const distributorResponse = await axios.get(`http://localhost:1234/api/distributors/${distributorId}`);
                setDistributorName(distributorResponse.data.DistributorName);
                setDistributorCountry(distributorResponse.data.CountryName);

                const productsResponse = await axios.get(`http://localhost:1234/api/products/country/${distributorResponse.data.CountryName}`);
                setProducts(productsResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:1234/api/logout', {}, { withCredentials: true });
            setRedirectToHome(true);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (redirectToHome) {
        return <Navigate to="/" />;
    }

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const parsedProducts = result.data.map(row => ({
                        code: row["Product Code"] || '',
                        description: row["Description"] || '',
                        minOrderQty: Number(row["MOQ"]) || 0,
                        price: parseFloat(row["Price"]) || 0,
                        quantityOrdered: parseInt(row["Quantity Ordered"], 10) || 0,
                        totalValue: (Number(row["Quantity Ordered"]) || 0) * (Number(row["Price"]) || 0),
                        isEditing: false,
                    }));

                    setProducts(parsedProducts);

                    const totalQty = parsedProducts.reduce((sum, product) => sum + Number(product.quantityOrdered), 0);
                    const totalValue = parsedProducts.reduce((sum, product) => sum + product.totalValue, 0);
                    setTotalQty(totalQty);
                    setTotalValue(totalValue);
                }
            });
        }
    };

    const handleQuantityChange = (index, newQty) => {
        const updatedProducts = products.map((product, i) => {
            if (i === index) {
                const updatedQty = Number(newQty);
                return { ...product, quantityOrdered: updatedQty, totalValue: updatedQty * product.price };
            }
            return product;
        });

        setProducts(updatedProducts);
        updateTotals(updatedProducts);
    };

    const handleEditToggle = (index) => {
        const updatedProducts = products.map((product, i) =>
            i === index
                ? { ...product, isEditing: !product.isEditing }
                : product
        );

        // If switching from editing to non-editing, update the totals
        if (updatedProducts[index].isEditing) {
            updateTotals(updatedProducts);
        }
        
        setProducts(updatedProducts);
    };

    const handleInputChange = (index, field, value) => {
        const updatedProducts = products.map((product, i) => {
            if (i === index) {
                const updatedProduct = {
                    ...product,
                    [field]: field === 'price' || field === 'minOrderQty' || field === 'quantityOrdered'
                        ? parseFloat(value) || 0
                        : value
                };
                updatedProduct.totalValue = updatedProduct.price * updatedProduct.quantityOrdered; // Recalculate total value
                return updatedProduct;
            }
            return product;
        });
        
        setProducts(updatedProducts);
        updateTotals(updatedProducts);
    };

    const updateTotals = (updatedProducts) => {
        const newTotalQty = updatedProducts.reduce((sum, product) => sum + Number(product.quantityOrdered), 0);
        const newTotalValue = updatedProducts.reduce((sum, product) => sum + product.totalValue, 0);
        setTotalQty(newTotalQty);
        setTotalValue(newTotalValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!distributorName.trim()) {
            alert('Distributor Name is required.');
            return;
        }
        if (!orderNo.trim()) {
            alert('Order No. is required.');
            return;
        }
        if (products.length === 0) {
            alert('You must upload a CSV file with products.');
            return;
        }

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (!product.code || !product.description || product.minOrderQty <= 0 || product.price <= 0 || product.quantityOrdered <= 0) {
                alert(`Product fields cannot be empty or zero. Please check product ${i + 1}.`);
                return;
            }
        }

        const orderData = {
            distributorName,
            orderNo,
            totalQty,
            totalValue,
            products
        };

        try {
            const response = await axios.post('http://localhost:1234/api/orders', orderData);
            if (response.status === 200) {
                alert('Order submitted successfully');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order');
        }
    };

    return (
        <div className="create-order-container">
            <nav className="navbar">
                <div className="navbar-brand">Acme Corp</div>
                <ul className="nav-links">
                    <li>Dashboard</li>
                    <li>Orders</li>
                    <li>Inventory</li>
                    <li>Customers</li>
                    <li>Products</li>
                    <li>Reports</li>
                    <li><img src="assets/dummy.jpg" alt="Profile" className="profile-pic" /></li>
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>

            <h2>Create an Order</h2>
            <Link to="/central-admin-orders">
                <button type="button">Go to Central Admin Order Management</button>
            </Link>
            <form onSubmit={handleSubmit} className="order-form">
                <h3>Step 1: Upload an Order Template</h3>
                <a href="/order_template.csv" download>
                    <button type="button">Download Template</button>
                </a>

                <input type="file" accept=".csv" onChange={handleCSVUpload} />

                <h3>Step 1: Review Product Catalog</h3>
                {isLoading ? (
                    <p>Loading product catalog...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div>
                        <h4>Product Details for {distributorCountry}</h4>
                        <table className="product-details-table">
                            <thead>
                                <tr>
                                    <th>Product Code</th>
                                    <th>Description</th>
                                    <th>MOQ</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.ItemCode}</td>
                                        <td>{product.ProductDescription}</td>
                                        <td>{product.MOQ}</td>
                                        <td>${Number(product.Price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <h3>Step 2: Review and Edit Your Order</h3>
                <input
                    type="text"
                    placeholder="Distributor Name"
                    value={distributorName}
                    onChange={(e) => setDistributorName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Order No."
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                />
                <div className="totals">
                    <p>Total Quantity: {totalQty}</p>
                    <p>Total Value: ${totalValue.toFixed(2)}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Product Code</th>
                            <th>Description</th>
                            <th>MOQ</th>
                            <th>Price</th>
                            <th>Quantity Ordered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>{product.code}</td>
                                <td>{product.description}</td>
                                <td>{product.minOrderQty}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>
                                    {product.isEditing ? (
                                        <input
                                            type="number"
                                            value={product.quantityOrdered}
                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                            min={1}
                                        />
                                    ) : (
                                        product.quantityOrdered
                                    )}
                                </td>
                                <td>
                                    <button type="button" onClick={() => handleEditToggle(index)}>
                                        {product.isEditing ? 'Save' : 'Edit'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="submit">Submit Order</button>
            </form>
        </div>
    );
};

export default CreateOrder;

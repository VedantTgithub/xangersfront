import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { useNavigate, Link } from 'react-router-dom';
 // Assuming you're adding some external CSS for styling

const CentralAdminDashboard = () => {
    const [consolidatedOrders, setConsolidatedOrders] = useState({});
    const [distributors, setDistributors] = useState([]);
    const [availableStock, setAvailableStock] = useState([]);
    const [reconciliationData, setReconciliationData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        // Check for session token in localStorage
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            navigate('/'); // Redirect to login page if no token
        }

        const fetchConsolidatedOrders = async () => {
            try {
                setLoading(true); // Start loading
                const response = await axios.get('http://localhost:1234/api/consolidated-orders', {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`, // Pass the session token in the header
                    }
                });
                setConsolidatedOrders(response.data);

                const distributorNames = new Set();
                Object.values(response.data).forEach(item => {
                    Object.keys(item.totals).forEach(name => distributorNames.add(name));
                });
                setDistributors(Array.from(distributorNames));
                setLoading(false); // Stop loading after fetching
            } catch (error) {
                console.error('Error fetching consolidated orders:', error);
                setLoading(false); // Stop loading even on error
            }
        };

        fetchConsolidatedOrders();
    }, [navigate]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    updateAvailableStock(results.data);
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                },
            });
        }
    };

    const updateAvailableStock = (data) => {
        const stockMap = {};
        data.forEach(item => {
            stockMap[item['Product Code']] = {
                description: item['Product Description'],
                available: Number(item['Available Stock']),
            };
        });
        setAvailableStock(stockMap);
        calculateReconciliation(stockMap);
    };

    const calculateReconciliation = (stockMap) => {
        const reconciledData = Object.entries(consolidatedOrders).map(([code, item]) => {
            const totalOrdered = Object.values(item.totals).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
            const availableStockData = stockMap[code] || { available: 0, description: '' };
            const available = availableStockData.available;
            const netPosition = available - totalOrdered;

            return {
                code,
                description: availableStockData.description || item.description,
                totalOrdered,
                available,
                netPosition,
            };
        });

        setReconciliationData(reconciledData);
    };

    const handleLogout = () => {
        // Clear session token on logout
        localStorage.removeItem('sessionToken');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <Link to="/view-product" className="nav-link">Manage Product</Link>
                <Link to="/central-admin-orders" className="nav-link">Order Management</Link>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </nav>

            <h2>Central Admin Order Management</h2>

            <section className="order-template-section">
                <a href="/order_template.csv" download>
                    <button className="download-button">Download Template for Stock</button>
                </a>
                <label htmlFor="csvFileUpload" className="file-upload-label">Upload CSV File:</label>
                <input id="csvFileUpload" type="file" accept=".csv" onChange={handleFileUpload} />
            </section>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <section className="orders-section">
                    <h3>Consolidated Orders</h3>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Product Code</th>
                                <th>Product Description</th>
                                {distributors.map((distributor, index) => (
                                    <th key={index}>{distributor}</th>
                                ))}
                                <th>Total Ordered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(consolidatedOrders).map(([code, item]) => {
                                const totalOrdered = Object.values(item.totals).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
                                return (
                                    <tr key={code}>
                                        <td>{code}</td>
                                        <td>{item.description}</td>
                                        {distributors.map((distributor) => (
                                            <td key={distributor}>{item.totals[distributor] || 0}</td>
                                        ))}
                                        <td>{totalOrdered}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            )}

            <section className="reconciliation-section">
                <h3>Stock Reconciliation</h3>
                <table className="reconciliation-table">
                    <thead>
                        <tr>
                            <th>Product Code</th>
                            <th>Product Description</th>
                            <th>Total Ordered</th>
                            <th>Available Stock</th>
                            <th>Net Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reconciliationData.map(({ code, description, totalOrdered, available, netPosition }) => (
                            <tr key={code}>
                                <td>{code}</td>
                                <td>{description}</td>
                                <td>{totalOrdered}</td>
                                <td>{available}</td>
                                <td>{netPosition >= 0 ? `+${netPosition}` : netPosition}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default CentralAdminDashboard;

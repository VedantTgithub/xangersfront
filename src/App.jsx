// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateOrder from './CreateOrder'; // Import your existing CreateOrder component
import CentralAdminOrderManagement from './CentralAdminOrderManagement'; // Import the new component
import './App.css'; // Import your CSS file
import RegistrationForm from './register';
import LoginForm from './login';
import AddProduct from './AddProduct';
import ProductList from './ProductList'; // Ensure ProductList is imported
import AddClassifications from './AddClassifications'; // Ensure AddClassifications is imported

const App = () => {
    return (
        <Router>
            <div>
                <div className="content"> {/* Add a content wrapper */}
                    <Routes>
                        <Route path="/" element={<LoginForm />} />
                        <Route path="/register" element={<RegistrationForm />} />
                        <Route path="/create-order" element={<CreateOrder />} />
                        <Route path="/central-admin-orders" element={<CentralAdminOrderManagement />} />
                        <Route path="/view-product" element={<ProductList />} />
                        <Route path="/add-classifications" element={<AddClassifications />} />
                        <Route path="/add-product" element={<AddProduct />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;

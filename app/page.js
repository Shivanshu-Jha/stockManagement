"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";



export default function Home() {

  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState("")
  const [dropdown, setDropdown] = useState([])


  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      let rjson = await response.json();
      setProducts(rjson.Products);
    }
    fetchProducts();
  }, [])



  // Function to add a product
  const addProduct = async (product) => {
    try {

      // Validate productForm before sending
      if (!productForm.slug || !productForm.category || !productForm.quantity || !productForm.price) {
        alert("All fields are required");
        return;
      }
      // Send productForm to the server
      if (productForm.quantity < 0 || productForm.price < 0) {
        alert("Quantity and Price must be non-negative");
        return;
      }
      if (isNaN(productForm.quantity) || isNaN(productForm.price)) {
        alert("Quantity and Price must be numbers");
        return;
      }
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add product');
      }

      const data = await response.json();
      console.log('Product added:', data);
      return data;
    } catch (err) {
      console.error(' Error adding product:', err.message);
      // return null;
    }
    const response = await fetch('/api/products');
    let rjson = await response.json();
    setProducts(rjson.Products);
    product.preventDefault(); // Prevent form submission

  };

  // Function to delete a product
  const deleteProduct = async (slug) => {
    if (!slug) return console.warn("No slug provided for deletion.");

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to delete product");
      }

      alert("Deleted `" + slug + "` successfully!");

      // Refresh the product list
      const fetchRes = await fetch("/api/products");
      const rjson = await fetchRes.json();
      setProducts(rjson.Products || []);
    } catch (err) {
      alert("Error deleting product:", err.message);
    }
  };




  // function to handle dropdown edit
  const onDropdownEdit = async (e) => {
    setQuery(e.target.value);
    if (query.length >= 1) {

      setDropdown([])
      const response = await fetch('/api/search?q=' + query);
      let rjson = await response.json();
      setDropdown(rjson.Products);
    } else {
      setDropdown([]);
    }

  }

  // Handle change in input fields
  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  }



  // Function to handle button actions in the dropdown
  const buttonAction = async (action, slug, initialQuantity) => {
    //Immediately change the quantity of the product with the slug in products

    let index = products.findIndex((item) => item.slug === slug);
    let newProducts = JSON.parse(JSON.stringify(products)); // deep copy
    if (action == "subtract") {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    }
    setProducts(newProducts)

    //Immediately change the quantity of the product with the slug in dropdown

    let indexDrop = dropdown.findIndex((item) => item.slug === slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown)); // deep copy
    if (action == "subtract") {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) - 1;
    } else {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) + 1;
    }
    setDropdown(newDropdown)
    console.log(action, slug);

    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    let r = await response.json();
    console.log(r);
  }

  return (
    <>
      <Navbar />


      {/* Search Product Section */}
      <div className="container rounded-lg bg-red-100 scale-75 mx-auto p-4 -mb-10"> <h1 className="text-2xl font-semibold">Search Product</h1> <div className="mt-1 bg-white p-2 rounded shadow-md flex gap-4">
        <input onBlur={() => { setTimeout(() => setDropdown([]), 100000); }} onChange={onDropdownEdit} type="text" className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search by name or price" />
      </div>

        <div className="dropContainer bg-gray-100 p-4 rounded-lg mt-1 border-b-2 border-gray-300">

          {dropdown.map(item => {
            return <div key={item.slug} className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow hover:shadow-md border-b border-gray-200 transition-all duration-200 cursor-pointer">
              <div className="text-gray-700 font-medium">
                <span className="text-lg">{item.slug}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({item.quantity} available for ₹{item.price})
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <button onClick={() => { buttonAction("subtract", item.slug, item.quantity) }} className="text-lg px-2 py-1 rounded hover:bg-gray-100">−</button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button onClick={() => { buttonAction("add", item.slug, item.quantity) }} className="text-lg px-2 py-1 rounded hover:bg-gray-100">+</button>
              </div>
            </div>
          })}
        </div>
      </div>

      {/* Stock Management Section */}
      <div className="container rounded-lg scale-75 mx-auto p-4 -mb-10">
        <h1 className="text-2xl font-bold">Add a Product</h1>

        {/* Product Form */}
        <form className="mt-4 bg-white p-6 rounded shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Product Slug</label>
              <input name="slug" onChange={handleChange} type="text" className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter product name" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Category</label>
              <input name="category" onChange={handleChange} type="text" className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter category" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Stock Quantity</label>
              <input name="quantity" onChange={handleChange} type="number" className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter stock quantity" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Price</label>
              <input name="price" onChange={handleChange} type="number" className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter price" />
            </div>
          </div>

          <button onClick={addProduct} type="submit" className="mt-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Product
          </button>
        </form>
      </div>


      {/* Display Current Stock Section */}
      <div className="container rounded-lg scale-75 mx-auto p-4">
        <h1 className="text-2xl font-bold text-center">Current Stock</h1>

        {/* Stock Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Stock Quantity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/*  row */}
              {products.map(item => {
                return (<tr key={item.slug} className="text-center">
                  <td className="border px-4 py-2">{item.slug}</td>
                  <td className="border px-4 py-2">{item.category}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">₹ {item.price}</td>
                  <td className="border px-4 py-2">

                    <button onClick={() => deleteProduct(item.slug)} className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
                )

              })}

            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}


import React, { useState } from 'react';
import { Upload, Trash2, Plus, Minus, Printer, CreditCard, ArrowRight, QrCode, Camera, Hash, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { showToast } from '../utils/toast';
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    printType: 'bw',
    bindType: 'none',
    paperSize: 'a4',
    orientation: 'portrait',
    copies: 1,
    estimatedPages: 1,
    confidential: false,
    doubleSided: false,
    additionalInstructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      showToast({
        title: "Files Added",
        description: `${newFiles.length} file(s) added successfully.`
      });
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
      showToast({
        title: "Files Added",
        description: `${newFiles.length} file(s) added successfully.`
      });
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const updateOrderDetail = (key: keyof typeof orderDetails, value: string | number) => {
    setOrderDetails(prev => ({ ...prev, [key]: value }));
  };
  
  const calculateTotal = () => {
    try {
      const basePrice = orderDetails.printType === 'color' ? 5 : 2;
      const bindingPrice = orderDetails.bindType === 'spiral' ? 20 : orderDetails.bindType === 'staple' ? 5 : 0;
      const paperMultiplier = orderDetails.paperSize === 'a3' ? 1.5 : 1;
      const totalPages = orderDetails.estimatedPages * orderDetails.copies;
      if (isNaN(totalPages) || isNaN(basePrice)) return 0;
      return Math.round((basePrice * totalPages * paperMultiplier) + bindingPrice);
    } catch {
      return 0;
    }
  };
  
  const nextStep = () => {
    if (currentStep === 1 && files.length === 0) {
      showToast({
        title: "No Files",
        description: "Please upload at least one file to continue.",
        type: "error"
      });
      return;
    }
    
    if (currentStep === 3 && paymentMethod === 'qr' && (!paymentScreenshot || !transactionId)) {
      showToast({
        title: "Payment Required",
        description: "Please upload payment screenshot and enter transaction ID.",
        type: "error"
      });
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const { user, isAuthenticated } = useAuth();

  const submitOrder = async () => {
    try {
      // Validate data
      if (files.length === 0) {
        showToast({ title: "Missing Files", description: "Please upload at least one file.", type: "error" });
        return;
      }
      if (paymentMethod === "qr" && (!paymentScreenshot || !transactionId)) {
        showToast({ title: "Payment Incomplete", description: "Please provide payment screenshot and transaction ID.", type: "error" });
        return;
      }
      if (!isAuthenticated || !user) {
        showToast({ title: "Authentication Required", description: "Please log in to submit order.", type: "error" });
        return;
      }

      let fileUrls;
      try {
        // Upload files to Cloudinary
        fileUrls = await Promise.all(
          files.map(async (file) => {
            const url = await uploadToCloudinary(file);
            return url;
          })
        );
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        showToast({ title: "Upload Failed", description: "Error uploading files to Cloudinary. Please try again.", type: "error" });
        return;
      }

      let paymentProofUrl = null;
      try {
        // Upload payment screenshot if applicable
        if (paymentMethod === "qr" && paymentScreenshot) {
          paymentProofUrl = await uploadToCloudinary(paymentScreenshot);
        }
      } catch (uploadError) {
        console.error("Payment screenshot upload error:", uploadError);
        showToast({ title: "Upload Failed", description: "Error uploading payment screenshot. Please try again.", type: "error" });
        return;
      }

      // Calculate total
      const totalCost = calculateTotal();

      // Construct order data
      const orderData = {
        userId: user.personalEmail, // Using email as user ID since we don't have direct access to Firebase UID
        files: fileUrls,
        printType: orderDetails.printType,
        bindType: orderDetails.bindType,
        paperSize: orderDetails.paperSize,
        orientation: orderDetails.orientation,
        copies: orderDetails.copies,
        estimatedPages: orderDetails.estimatedPages,
        confidential: orderDetails.confidential,
        doubleSided: orderDetails.doubleSided,
        additionalInstructions: orderDetails.additionalInstructions,
        paymentMethod,
        transactionId: paymentMethod === "qr" ? transactionId : null,
        paymentProofUrl,
        totalCost,
        status: "pending",
        createdAt: Timestamp.now(),
      };

      try {
        // Save to Firestore
        await addDoc(collection(db, "orders"), orderData);
      } catch (firestoreError) {
        console.error("Firestore save error:", firestoreError);
        showToast({ title: "Database Error", description: "Failed to save order to Firestore. Check your connection or permissions.", type: "error" });
        return;
      }

      // Advance to confirmation
      setCurrentStep(4);
      showToast({ title: "Success", description: "Order placed successfully!" });
    } catch (error) {
      console.error("Unexpected order submission error:", error);
      showToast({ title: "Error", description: "An unexpected error occurred. Please try again.", type: "error" });
    }
  };
  
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Upload Your Files</h2>
            <p className="text-gray-600">Drag and drop your files or click to browse</p>
            
            <motion.div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input 
                type="file" 
                id="fileUpload" 
                className="hidden" 
                multiple 
                onChange={handleFileChange} 
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (Max 20MB each)</p>
              </label>
            </motion.div>
            
            {files.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-3">Uploaded Files ({files.length})</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded">
                          <Printer size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium truncate max-w-xs">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Printing Specifications</h2>
            <p className="text-gray-600">Specify your printing requirements</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Print Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateOrderDetail('printType', 'bw')}
                      className={`p-3 border rounded-lg flex items-center ${
                        orderDetails.printType === 'bw' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="w-6 h-6 bg-gray-800 rounded-full mr-2"></div>
                      <span>Black & White</span>
                    </button>
                    <button
                      onClick={() => updateOrderDetail('printType', 'color')}
                      className={`p-3 border rounded-lg flex items-center ${
                        orderDetails.printType === 'color' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 rounded-full mr-2"></div>
                      <span>Color</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bind Type</label>
                  <select 
                    value={orderDetails.bindType}
                    onChange={(e) => updateOrderDetail('bindType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="none">None</option>
                    <option value="spiral">Spiral Binding</option>
                    <option value="staple">Staple</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Copies</label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateOrderDetail('copies', Math.max(1, orderDetails.copies - 1))}
                      className="bg-gray-100 p-2 rounded-l-lg border border-gray-300"
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="number" 
                      value={orderDetails.copies}
                      onChange={(e) => updateOrderDetail('copies', parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-t border-b border-gray-300 py-2"
                      min="1"
                    />
                    <button 
                      onClick={() => updateOrderDetail('copies', orderDetails.copies + 1)}
                      className="bg-gray-100 p-2 rounded-r-lg border border-gray-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Number of Pages</label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateOrderDetail('estimatedPages', Math.max(1, orderDetails.estimatedPages - 1))}
                      className="bg-gray-100 p-2 rounded-l-lg border border-gray-300"
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="number" 
                      value={orderDetails.estimatedPages}
                      onChange={(e) => updateOrderDetail('estimatedPages', parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-t border-b border-gray-300 py-2"
                      min="1"
                    />
                    <button 
                      onClick={() => updateOrderDetail('estimatedPages', orderDetails.estimatedPages + 1)}
                      className="bg-gray-100 p-2 rounded-r-lg border border-gray-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paper Size</label>
                  <select 
                    value={orderDetails.paperSize}
                    onChange={(e) => updateOrderDetail('paperSize', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="a4">A4</option>
                    <option value="a3">A3</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateOrderDetail('orientation', 'portrait')}
                      className={`p-3 border rounded-lg flex flex-col items-center ${
                        orderDetails.orientation === 'portrait' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="w-10 h-14 bg-gray-200 rounded mb-2"></div>
                      <span className="text-sm">Portrait</span>
                    </button>
                    <button
                      onClick={() => updateOrderDetail('orientation', 'landscape')}
                      className={`p-3 border rounded-lg flex flex-col items-center ${
                        orderDetails.orientation === 'landscape' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="w-14 h-10 bg-gray-200 rounded mb-2"></div>
                      <span className="text-sm">Landscape</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="confidential"
                        checked={orderDetails.confidential}
                        onChange={(e) => updateOrderDetail('confidential', e.target.checked ? 'true' : 'false')}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="confidential" className="ml-2 block text-sm text-gray-700">
                        Confidential
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="doubleSided"
                        checked={orderDetails.doubleSided}
                        onChange={(e) => updateOrderDetail('doubleSided', e.target.checked ? 'true' : 'false')}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="doubleSided" className="ml-2 block text-sm text-gray-700">
                        Double-Sided Printing
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Instructions</label>
                  <textarea
                    value={orderDetails.additionalInstructions}
                    onChange={(e) => updateOrderDetail('additionalInstructions', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none"
                    placeholder="Any special instructions for your print order..."
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order Summary & Payment</h2>
            <p className="text-gray-600">Review your order and choose payment method</p>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Files</span>
                  <span className="font-medium">{files.length} file(s)</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Print Type</span>
                  <span className="font-medium">{orderDetails.printType === 'bw' ? 'Black & White' : 'Color'}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Bind Type</span>
                  <span className="font-medium capitalize">
                    {orderDetails.bindType === 'none' ? 'None' : orderDetails.bindType}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Copies</span>
                  <span className="font-medium">{orderDetails.copies}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Estimated Pages</span>
                  <span className="font-medium">{orderDetails.estimatedPages}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Paper Size</span>
                  <span className="font-medium capitalize">{orderDetails.paperSize}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Orientation</span>
                  <span className="font-medium capitalize">{orderDetails.orientation}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Double-Sided</span>
                  <span className="font-medium">{orderDetails.doubleSided ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Confidential</span>
                  <span className="font-medium">{orderDetails.confidential ? 'Yes' : 'No'}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Cost</span>
                <span>₹{calculateTotal()}.00</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-lg mb-4">Payment Method</h3>
              
              <div className="space-y-3">
                <div className="border rounded-lg p-3 flex items-center">
                  <input 
                    type="radio"
                    id="qr"
                    name="payment" 
                    value="qr"
                    checked={paymentMethod === 'qr'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <label htmlFor="qr" className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <QrCode size={16} className="text-green-600" />
                    </div>
                    <span>QR Code Payment</span>
                  </label>
                </div>
                
                <div className="border rounded-lg p-3 flex items-center">
                  <input 
                    type="radio" 
                    id="pickup" 
                    name="payment" 
                    value="pickup"
                    checked={paymentMethod === 'pickup'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3" 
                  />
                  <label htmlFor="pickup" className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-orange-600 font-bold text-xs">₹</span>
                    </div>
                    <span>Pay at Pickup</span>
                  </label>
                </div>
              </div>
              
              {paymentMethod === 'qr' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center mb-4">
                      <img 
                        src="https://ik.imagekit.io/cj5ujtn9k/upi_qr.jpg?updatedAt=1753642580954" 
                        alt="UPI QR Code for payment" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Scan this QR code to pay ₹{calculateTotal()}.00</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Screenshot
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction ID
                      </label>
                      <div className="relative">
                        <Hash size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter transaction ID"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                {paymentMethod === 'qr' ? 'Order Placed Successfully & Payment Verified' : 'Order Placed Successfully'}
              </h2>
              <p className="text-gray-600">
                {paymentMethod === 'qr' 
                  ? 'Your payment has been verified and your order is being processed.'
                  : 'Pay at Collection. Your order is being processed.'
                }
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-lg mb-4">Order Details</h3>
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#ORD{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">₹{calculateTotal()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {paymentMethod === 'qr' ? 'QR Code Payment' : 'Pay at Pickup'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Order will be ready soon!</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentStep(1);
                  setFiles([]);
                  setPaymentScreenshot(null);
                  setTransactionId('');
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Place Another Order
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')} // Using navigate from useNavigate hook
              >
                Go to Dashboard
              </motion.button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between relative">
              {["Upload Files", "Specifications", "Payment", "Confirmation"].map((step, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center relative z-10"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > index + 1 
                      ? 'bg-green-500 text-white' 
                      : currentStep === index + 1 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > index + 1 ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="text-xs mt-2 text-center">{step}</div>
                </div>
              ))}
              
              {/* Progress Bar */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(currentStep - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="mt-10 flex justify-between">
              {currentStep > 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </motion.button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 4 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={currentStep === 3 ? submitOrder : nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <span>Continue</span>
                  <ArrowRight size={16} className="ml-2" />
                </motion.button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
window.onerror = function (message, source, lineno, colno, error) {
  console.error("Global Error:", message, error);
};

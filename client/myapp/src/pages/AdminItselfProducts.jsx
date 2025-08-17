import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  productByUser,
  makeProductInactive,
  makeProductactive,
  addDiscount,
  finishDiscount,
  deleteProduct,
  updateProduct,
} from "../features/ProductFeatures";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Avatar,
  CircularProgress,
  Modal,
  Box,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from "@mui/material";

import { Delete, LocalOffer, ToggleOn, ToggleOff, Edit } from "@mui/icons-material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: "90vh",
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

const MAX_IMAGES = 5;

const VALID_CATEGORIES = ["watch", "hoodies", "electric", "furniture"];
const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const VALID_COLORS = ["Red", "Blue", "Green", "Black", "White", "Yellow"];
const VALID_TAGS = ["New", "Sale", "Popular", "Limited"];

const AdminItselfProducts = () => {
  const dispatch = useDispatch();
  const limit = 50;
  const page = 1;

  const allProducts = useSelector(state => Array.isArray(state.product.list) ? state.product.list : []);
  const { status, error } = useSelector(state => state.product);

  const [openEdit, setOpenEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    sizes: [],
    colors: [],
    tags: [],
    newImages: [],
    oldImages: [],
    previewImages: [],
    imagesToRemove: [],
  });

  useEffect(() => {
    if (status === "idle") dispatch(productByUser({ limit, page }));
  }, [status, dispatch]);

  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const handleToggleActive = async (product) => {
    try {
      if (product.isActive) await dispatch(makeProductInactive(product._id)).unwrap();
      else await dispatch(makeProductactive(product._id)).unwrap();
      dispatch(productByUser({ limit, page }));
      showSnackbar('Product status updated successfully', 'success');
    } catch (err) { showSnackbar(err.message || 'Failed to update product status', 'error'); }
  };

  const handleDiscount = async (product) => {
    try {
      if (product.discountPrice) {
        await dispatch(finishDiscount(product._id)).unwrap();
        showSnackbar('Discount removed successfully', 'success');
      } else {
        const discountPrice = prompt("Enter Discount Price:");
        if (!discountPrice) return;
        await dispatch(addDiscount({ id: product._id, discountPrice: parseFloat(discountPrice) })).unwrap();
        showSnackbar('Discount added successfully', 'success');
      }
      dispatch(productByUser({ limit, page }));
    } catch (err) { showSnackbar(err.message || 'Failed to update discount', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      dispatch(productByUser({ limit, page }));
      showSnackbar('Product deleted successfully', 'success');
    } catch (err) { showSnackbar(err.message || 'Failed to delete product', 'error'); }
  };

  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || "",
      category: product.category,
      stock: product.stock,
      sizes: product.sizes || [],
      colors: product.color || [],
      tags: product.tags || [],
      newImages: [],
      oldImages: product.image || [],
      previewImages: (product.image || []).map(img => ({ url: img.url, isOld: true, id: img._id || img.url })),
      imagesToRemove: [],
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "",
      stock: "",
      sizes: [],
      colors: [],
      tags: [],
      newImages: [],
      oldImages: [],
      previewImages: [],
      imagesToRemove: [],
    });
  };

  const handleFormChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = formData.newImages.length + files.length + formData.previewImages.filter(img => !formData.imagesToRemove.includes(img.id)).length;
    if (totalImages > MAX_IMAGES) return showSnackbar(`Maximum ${MAX_IMAGES} images allowed`, 'error');
    const newImages = [...formData.newImages, ...files];
    const newPreviewImages = [
      ...formData.previewImages.filter(img => !formData.imagesToRemove.includes(img.id)),
      ...files.map(f => ({ url: URL.createObjectURL(f), isOld: false, id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }))
    ];
    setFormData(prev => ({
      ...prev,
      newImages,
      previewImages: newPreviewImages,
      imagesToRemove: prev.imagesToRemove.filter(id => newPreviewImages.some(img => img.id === id))
    }));
    e.target.value = null;
  };

  const handleRemoveImage = (image) => {
    if (image.isOld) {
      setFormData(prev => ({
        ...prev,
        imagesToRemove: [...prev.imagesToRemove, image.id],
        previewImages: prev.previewImages.filter(img => img.id !== image.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => !prev.previewImages.find(img => img.id === image.id && !img.isOld)),
        previewImages: prev.previewImages.filter(img => img.id !== image.id)
      }));
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock)
        throw new Error('Please fill all required fields');

      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("description", formData.description);
      updateData.append("price", parseFloat(formData.price));
      updateData.append("category", formData.category);
      updateData.append("stock", parseInt(formData.stock));
      if (formData.discountPrice) updateData.append("discountPrice", parseFloat(formData.discountPrice));
      formData.imagesToRemove.forEach(id => updateData.append("imagesToRemove[]", id));
      formData.newImages.forEach(img => updateData.append("image", img));
      formData.sizes.forEach(s => updateData.append("sizes[]", s));
      formData.colors.forEach(c => updateData.append("color[]", c));
      formData.tags.forEach(t => updateData.append("tags[]", t));

      await dispatch(updateProduct({ id: editProduct._id, data: updateData })).unwrap();
      showSnackbar('Product updated successfully', 'success');
      handleCloseEdit();
      dispatch(productByUser({ limit, page }));
    } catch (err) { showSnackbar(err.message || 'Failed to update product', 'error'); }
  };

  if (status === "loading") return <div className="flex justify-center items-center p-5"><CircularProgress /></div>;
  if (error) return <p className="text-center text-red-500 p-5">{error}</p>;

  return (
    <Container maxWidth="xl" className="p-5">
      <Typography variant="h4" gutterBottom>My Products</Typography>
      {allProducts.length === 0 ? <Typography>No products found.</Typography> :
      <TableContainer component={Paper} className="rounded-2xl shadow-md">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Discount</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProducts.map(product => (
              <TableRow key={product._id}>
                <TableCell>
                  {product.image && product.image[0] ? (
                    <Avatar variant="square" src={product.image[0].url} />
                  ) : "-"}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.discountPrice ? `$${product.discountPrice}` : "-"}</TableCell>
                <TableCell>{product.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit"><IconButton onClick={() => handleOpenEdit(product)}><Edit /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton onClick={() => handleDelete(product._id)}><Delete /></IconButton></Tooltip>
                  <Tooltip title={product.isActive ? "Deactivate" : "Activate"}>
                    <IconButton onClick={() => handleToggleActive(product)}>
                      {product.isActive ? <ToggleOn color="success"/> : <ToggleOff color="error"/>}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={product.discountPrice ? "Remove Discount" : "Add Discount"}>
                    <IconButton onClick={() => handleDiscount(product)}><LocalOffer color="primary"/></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}

      {/* Edit Modal */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>Edit Product</Typography>
          <FormControl fullWidth margin="dense">
            <InputLabel>Name</InputLabel>
            <OutlinedInput value={formData.name} onChange={e => handleFormChange("name", e.target.value)} />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Description</InputLabel>
            <OutlinedInput value={formData.description} onChange={e => handleFormChange("description", e.target.value)} multiline rows={3} />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Price</InputLabel>
            <OutlinedInput type="number" value={formData.price} onChange={e => handleFormChange("price", e.target.value)} />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Discount Price</InputLabel>
            <OutlinedInput type="number" value={formData.discountPrice} onChange={e => handleFormChange("discountPrice", e.target.value)} />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select value={formData.category} onChange={e => handleFormChange("category", e.target.value)}>
              {VALID_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Stock</InputLabel>
            <OutlinedInput type="number" value={formData.stock} onChange={e => handleFormChange("stock", e.target.value)} />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Sizes</InputLabel>
            <Select multiple value={formData.sizes} onChange={e => handleFormChange("sizes", e.target.value)} input={<OutlinedInput label="Sizes" />} renderValue={(selected) => selected.join(", ")}>
              {VALID_SIZES.map(size => <MenuItem key={size} value={size}><Chip label={size} /></MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Colors</InputLabel>
            <Select multiple value={formData.colors} onChange={e => handleFormChange("colors", e.target.value)} input={<OutlinedInput label="Colors" />} renderValue={(selected) => selected.join(", ")}>
              {VALID_COLORS.map(color => <MenuItem key={color} value={color}><Chip label={color} /></MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Tags</InputLabel>
            <Select multiple value={formData.tags} onChange={e => handleFormChange("tags", e.target.value)} input={<OutlinedInput label="Tags" />} renderValue={(selected) => selected.join(", ")}>
              {VALID_TAGS.map(tag => <MenuItem key={tag} value={tag}><Chip label={tag} /></MenuItem>)}
            </Select>
          </FormControl>

          <Box mt={2} mb={2}>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
            <Box className="flex flex-wrap mt-2">
              {formData.previewImages.map(img => (
                <Box key={img.id} className="relative mr-2 mb-2">
                  <img src={img.url} alt="preview" width={60} height={60} className="object-cover border rounded" />
                  <Button size="small" onClick={() => handleRemoveImage(img)} style={{position:"absolute", top:0, right:0}}>X</Button>
                </Box>
              ))}
            </Box>
          </Box>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleEditSubmit}>Update</Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseEdit} sx={{ml:1}}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminItselfProducts;

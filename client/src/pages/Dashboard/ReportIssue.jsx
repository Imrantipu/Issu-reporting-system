import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import apiClient from '../../lib/apiClient';

const categories = [
  'Road Safety',
  'Lighting',
  'Sanitation',
  'Water',
  'Traffic',
  'Footpath',
];

const ReportIssue = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0],
    location: '',
    imageFile: null,
  });
  const [feedback, setFeedback] = useState('');
  const [uploading, setUploading] = useState(false);

  const createIssue = useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/issues', payload);
      return res.data;
    },
    onSuccess: () => {
      setFeedback('Issue created successfully.');
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      navigate('/all-issues');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Failed to create issue.';
      setFeedback(msg);
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setForm((prev) => ({ ...prev, imageFile: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImage = async (file) => {
    const key = import.meta.env.VITE_image_host_key;
    if (!key) throw new Error('Image host key missing');
    const fd = new FormData();
    fd.append('image', file);
    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${key}`, fd);
    return res.data?.data?.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    if (!form.title || !form.description) {
      setFeedback('Title and description are required.');
      return;
    }

    let imageUrl = '';
    if (form.imageFile) {
      try {
        setUploading(true);
        imageUrl = await uploadImage(form.imageFile);
      } catch (err) {
        setFeedback('Image upload failed. Please try again.');
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    createIssue.mutate({
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      imageUrl,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="eyebrow">Report issue</span>
        <h1 className="text-3xl font-bold text-slate-900">Submit a new public issue</h1>
        <p className="text-slate-600">Add details so staff can triage quickly. You can edit while status is pending.</p>
      </div>

      {feedback && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {feedback}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel space-y-4 rounded-3xl border border-slate-100/70 bg-white/85 p-6 shadow-xl shadow-cyan-200/40">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
              placeholder="E.g., Major pothole near 5th Street"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
            placeholder="What happened? How does it impact people? Include any observations."
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
              placeholder="e.g., 5th Street & Oak Ave"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Upload image</label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createIssue.isLoading || uploading}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {createIssue.isLoading || uploading ? 'Submitting...' : 'Submit issue'}
          <span aria-hidden>→</span>
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;

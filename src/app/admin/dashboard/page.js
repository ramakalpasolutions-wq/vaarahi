'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  FaBuilding, FaImage, FaEnvelope, FaSignOutAlt, FaBars, FaTimes,
  FaTrash, FaEdit, FaEye, FaUpload, FaHome, FaChartBar, FaDesktop,
  FaArrowUp, FaArrowDown, FaTh, FaStar, FaPlus,
  FaArrowLeft, FaMapMarkerAlt, FaPlayCircle, FaCheck,
} from 'react-icons/fa';

const C = {
  cream: '#fdf6ec', creamDark: '#f5e6cc', creamLight: '#fefaf4',
  teal: '#0d7377', tealLight: '#14919b', tealDark: '#0a5c5f',
  orange: '#ff6b35', orangeLight: '#ff8c5a',
  magenta: '#d63384', magentaLight: '#e91e63',
  text: '#2d4647', textLight: '#5a7a7c',
  border: '#e8dfd0', white: '#ffffff',
  success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  info: '#3b82f6',
};

const ICON_OPTIONS = [
  'check','water','electricity','tree','road','security','children',
  'pool','gym','parking','light','wifi','home','building','school',
  'university','hospital','shopping','bus','train','layout','drop','clean',
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [heroes, setHeroes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [selectedHeroPage, setSelectedHeroPage] = useState('home');
  const [heroSlides, setHeroSlides] = useState([]);
  const [autoScrollSeconds, setAutoScrollSeconds] = useState(5);
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);

  const [projectView, setProjectView] = useState('list');
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', location: '', heroImage: '', description: '', about: '',
    video: '', ctaImage: '', amenities: [], highlights: [],  brochurePdf: '',
    locationHighlights: [], images: [],
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '', category: 'project', imageUrl: '', description: '',
    mediaType: 'image', youtubeUrl: '', youtubeId: '', uploadType: 'image',
  });

  const [plotTypeForm, setPlotTypeForm] = useState({ title: '', description: '', imageUrl: '' });
  const [editingPlotType, setEditingPlotType] = useState(null);
  const [uploading, setUploading] = useState(false);

  const extractYouTubeId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?\/\s]{11})/);
    return match?.[1] || '';
  };

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth || !JSON.parse(auth).loggedIn) { router.push('/admin/login'); return; }
    fetchAll();
  }, []);

  useEffect(() => {
    const existing = heroes.find(h => h.page === selectedHeroPage);
    if (existing) { setHeroSlides(existing.slides || []); setAutoScrollSeconds(existing.autoScrollSeconds || 5); }
  }, [heroes, selectedHeroPage]);

  const fetchAll = () => { fetchHeroes(); fetchProjects(); fetchGallery(); fetchContacts(); };
  const fetchHeroes = async () => { try { const r = await fetch('/api/hero'); const d = await r.json(); if (d.success) setHeroes(d.data || []); } catch {} };
  const fetchProjects = async () => { try { const r = await fetch('/api/projects'); const d = await r.json(); if (d.success) setProjects(d.data); } catch {} };
  const fetchGallery = async () => { try { const r = await fetch('/api/gallery'); const d = await r.json(); if (d.success) setGallery(d.data); } catch {} };
  const fetchContacts = async () => { try { const r = await fetch('/api/contacts'); const d = await r.json(); if (d.success) setContacts(d.data); } catch {} };

  const handleLogout = () => { localStorage.removeItem('adminAuth'); toast.success('Logged out!'); router.push('/admin/login'); };

  const handleUpload = async (e, callback) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try {
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (d.success) { callback(d); toast.success('Uploaded!'); } else toast.error(d.error);
    } catch { toast.error('Upload failed'); }
    setUploading(false); e.target.value = '';
  };

  const loadHeroForPage = (page) => {
    setSelectedHeroPage(page);
    const existing = heroes.find(h => h.page === page);
    if (existing) { setHeroSlides(existing.slides || []); setAutoScrollSeconds(existing.autoScrollSeconds || 5); }
    else { setHeroSlides([]); setAutoScrollSeconds(5); }
    setEditingSlideIndex(null);
  };

  const handleQuickUploadAndSave = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    if (heroSlides.length + files.length > 10) { toast.error(`Max 10 slides. Add ${10 - heroSlides.length} more.`); return; }
    setBulkUploading(true);
    toast.loading(`Uploading ${files.length} files...`, { id: 'quick' });
    const newSlides = [...heroSlides]; let successCount = 0;
    for (const file of files) {
      const fd = new FormData(); fd.append('file', file);
      try {
        const r = await fetch('/api/upload', { method: 'POST', body: fd });
        const d = await r.json();
        if (d.success) { newSlides.push({ mediaType: d.type, mediaUrl: d.url, subtitle: '', title: '', description: '', ctaText: '', ctaLink: '', secondaryCTA: '', secondaryCTALink: '' }); successCount++; }
      } catch {}
    }
    setHeroSlides(newSlides);
    if (successCount > 0) {
      try {
        const res = await fetch('/api/hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: selectedHeroPage, slides: newSlides, autoScrollSeconds }) });
        const data = await res.json();
        if (data.success) { toast.success(`🎉 ${successCount} slide(s) saved!`, { id: 'quick' }); fetchHeroes(); }
      } catch {}
    }
    setBulkUploading(false); e.target.value = '';
  };

  const moveSlide = (index, direction) => {
    const s = [...heroSlides]; const ni = direction === 'up' ? index - 1 : index + 1;
    if (ni < 0 || ni >= s.length) return;
    [s[index], s[ni]] = [s[ni], s[index]]; setHeroSlides(s);
  };

  const removeSlide = (index) => { if (!confirm('Remove slide?')) return; setHeroSlides(heroSlides.filter((_, i) => i !== index)); toast.success('Removed. Save All to publish.'); };

  const saveAllSlides = async () => {
    if (!heroSlides.length) { toast.error('Add at least one slide'); return; }
    try {
      const res = await fetch('/api/hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: selectedHeroPage, slides: heroSlides, autoScrollSeconds }) });
      const data = await res.json();
      if (data.success) { toast.success(`✅ Saved ${heroSlides.length} slides!`); fetchHeroes(); }
    } catch { toast.error('Failed to save'); }
  };

  const resetProjectForm = () => {
    setProjectForm({ title: '', location: '', heroImage: '', description: '', about: '', video: '', ctaImage: '',  brochurePdf: '', amenities: [], highlights: [], locationHighlights: [], images: [] });
    setEditingProject(null);
  };

  const openProjectDetail = (project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({ title: project.title || '', location: project.location || '', heroImage: project.heroImage || '',  brochurePdf: project.brochurePdf || '', description: project.description || '', about: project.about || '', video: project.video || '', ctaImage: project.ctaImage || '', amenities: project.amenities || [], highlights: project.highlights || [], locationHighlights: project.locationHighlights || [], images: project.images || [] });
    } else resetProjectForm();
    setProjectView('detail'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.location) { toast.error('Title & Location required!'); return; }
    try {
      const method = editingProject ? 'PUT' : 'POST';
      const body = editingProject ? { id: editingProject._id, ...projectForm } : projectForm;
      const r = await fetch('/api/projects', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.success) { toast.success(editingProject ? '✅ Updated!' : '🏗️ Added!'); fetchProjects(); setProjectView('list'); resetProjectForm(); }
      else toast.error('Failed: ' + d.error);
    } catch (err) { toast.error('Error: ' + err.message); }
  };

  const deleteProject = async (id) => { if (!confirm('Delete?')) return; await fetch(`/api/projects?id=${id}`, { method: 'DELETE' }); toast.success('Deleted!'); fetchProjects(); };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (galleryForm.uploadType === 'image' && !galleryForm.imageUrl) { toast.error('Upload image first!'); return; }
    if (galleryForm.uploadType === 'youtube' && !galleryForm.youtubeUrl) { toast.error('Enter YouTube URL!'); return; }
    if (galleryForm.uploadType === 'best-property' && !galleryForm.imageUrl) { toast.error('Upload image first!'); return; }

    let youtubeId = '';
    if (galleryForm.uploadType === 'youtube') { youtubeId = extractYouTubeId(galleryForm.youtubeUrl); if (!youtubeId) { toast.error('Invalid YouTube URL!'); return; } }

    let payload = {};
    if (galleryForm.uploadType === 'best-property') payload = { title: 'Best Property', description: '', imageUrl: galleryForm.imageUrl, category: 'best-property', mediaType: 'image', youtubeUrl: '', youtubeId: '' };
    else if (galleryForm.uploadType === 'youtube') payload = { title: 'Video', description: '', category: 'videos', mediaType: 'youtube', youtubeUrl: galleryForm.youtubeUrl, youtubeId, imageUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` };
    else payload = { title: 'Image', description: '', category: 'project', mediaType: 'image', youtubeUrl: '', youtubeId: '', imageUrl: galleryForm.imageUrl };

    try {
      const res = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        toast.success(galleryForm.uploadType === 'youtube' ? '🎬 Video added!' : galleryForm.uploadType === 'best-property' ? '🏆 Best Property added!' : '🖼️ Image added!');
        setGalleryForm({ title: '', category: 'project', imageUrl: '', description: '', mediaType: 'image', youtubeUrl: '', youtubeId: '', uploadType: 'image' });
        fetchGallery();
      } else toast.error('Failed: ' + (data.error || 'Unknown'));
    } catch (err) { toast.error('Error: ' + err.message); }
  };

  const deleteGalleryItem = async (id) => { if (!confirm('Delete?')) return; await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchGallery(); };

  const plotTypes = gallery.filter(g => g.category === 'plot-type');

  const handlePlotTypeSubmit = async (e) => {
    e.preventDefault();
    if (!plotTypeForm.imageUrl) { toast.error('Upload image!'); return; }
    if (!plotTypeForm.title) { toast.error('Title required!'); return; }
    try {
      if (editingPlotType) {
        await fetch('/api/gallery', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingPlotType._id, title: plotTypeForm.title, description: plotTypeForm.description, imageUrl: plotTypeForm.imageUrl, category: 'plot-type' }) });
        toast.success('✅ Updated!');
      } else {
        await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: plotTypeForm.title, description: plotTypeForm.description, imageUrl: plotTypeForm.imageUrl, category: 'plot-type' }) });
        toast.success('🏠 Added!');
      }
      setPlotTypeForm({ title: '', description: '', imageUrl: '' }); setEditingPlotType(null); fetchGallery();
    } catch { toast.error('Failed'); }
  };

  const advantageImages = gallery.filter(g => g.category === 'advantage');

  const handleAdvantageBulkUpload = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploading(true); toast.loading(`Uploading ${files.length} files...`, { id: 'adv' });
    let successCount = 0;
    for (const file of files) {
      const fd = new FormData(); fd.append('file', file);
      try {
        const r = await fetch('/api/upload', { method: 'POST', body: fd }); const d = await r.json();
        if (d.success) { await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: `Advantage ${advantageImages.length + successCount + 1}`, imageUrl: d.url, category: 'advantage' }) }); successCount++; }
      } catch {}
    }
    setUploading(false);
    if (successCount > 0) { toast.success(`🎉 ${successCount} added!`, { id: 'adv' }); fetchGallery(); }
    e.target.value = '';
  };

  const deleteContact = async (id) => { if (!confirm('Delete?')) return; await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchContacts(); };
  const markRead = async (id) => { await fetch('/api/contacts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isRead: true }) }); fetchContacts(); };

  const menuItems = [
    { key: 'dashboard', icon: <FaChartBar />, label: 'Dashboard', badge: null },
    { key: 'hero', icon: <FaDesktop />, label: 'Hero Sections', badge: heroes.reduce((s, h) => s + (h.slides?.length || 0), 0) },
    { key: 'plot-types', icon: <FaTh />, label: 'Plot Types', badge: plotTypes.length },
    { key: 'advantage', icon: <FaStar />, label: 'Advantage', badge: advantageImages.length },
    { key: 'projects', icon: <FaBuilding />, label: 'Projects', badge: projects.length },
    { key: 'gallery', icon: <FaImage />, label: 'Gallery', badge: gallery.filter(g => !['plot-type','advantage'].includes(g.category)).length },
    { key: 'contacts', icon: <FaEnvelope />, label: 'Messages', badge: contacts.filter(c => !c.isRead).length, alert: true },
  ];

  const addItem = (key, arr, setFn, newItem) => setFn(p => ({ ...p, [key]: [...arr, newItem] }));
  const updateItem = (key, arr, setFn, i, field, val) => { const l = [...arr]; l[i][field] = val; setFn(p => ({ ...p, [key]: l })); };
  const removeItem = (key, arr, setFn, i) => setFn(p => ({ ...p, [key]: arr.filter((_, j) => j !== i) }));

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }
        
        :root {
          --sidebar-width: 260px;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #fdf6ec 0%, #fefaf4 100%);
        }

        /* SIDEBAR */
        .sidebar {
          width: var(--sidebar-width);
          min-width: var(--sidebar-width);
          background: linear-gradient(180deg, #0d7377 0%, #0a5c5f 100%);
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          z-index: 200;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 4px 0 24px rgba(0,0,0,0.12);
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 199;
          backdrop-filter: blur(2px);
        }

        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          min-width: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .sidebar-overlay.open {
            display: block;
          }
          .main-content {
            margin-left: 0;
          }
        }

        /* Topbar */
        .topbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
          border-bottom: 1px solid #e8dfd0;
          padding: 0 20px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 2px 12px rgba(13,115,119,0.06);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: #fdf6ec;
          color: #0d7377;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .hamburger-btn { display: flex; }
        }

        .page-title {
          font-size: clamp(16px, 2.5vw, 20px);
          font-weight: 700;
          color: #2d4647;
          font-family: 'Playfair Display', serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .page-sub {
          font-size: 11px;
          color: #5a7a7c;
          margin-top: 1px;
        }

        /* Cards & Grids */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid #e8dfd0;
          box-shadow: 0 2px 12px rgba(13,115,119,0.05);
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(13,115,119,0.12);
          border-color: #14919b;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .stat-num {
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
          font-family: 'Playfair Display', serif;
        }

        .stat-label {
          font-size: 11px;
          color: #5a7a7c;
          font-weight: 600;
          margin-top: 3px;
        }

        /* Card */
        .card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e8dfd0;
          box-shadow: 0 4px 20px rgba(13,115,119,0.05);
          overflow: hidden;
        }

        .card-header {
          padding: 18px 20px;
          border-bottom: 1px solid #e8dfd0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          background: linear-gradient(135deg, #fdf6ec, #fefaf4);
        }

        .card-body {
          padding: 20px;
        }

        @media (max-width: 480px) {
          .card-body { padding: 14px; }
          .card-header { padding: 14px; }
        }

        /* Section box inside form */
        .section-box {
          background: linear-gradient(135deg, #fdf6ec, #fefaf4);
          border: 1px solid #e8dfd0;
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 14px;
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Form controls */
        .form-group { margin-bottom: 14px; }
        .form-label {
          display: block;
          margin-bottom: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #0d7377;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          background: white;
          border: 2px solid #e8dfd0;
          border-radius: 10px;
          padding: 11px 14px;
          color: #2d4647;
          font-size: 13px;
          width: 100%;
          outline: none;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          border-color: #0d7377;
          box-shadow: 0 0 0 3px rgba(13,115,119,0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 90px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .form-grid-2 { grid-template-columns: 1fr; }
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 22px;
          border-radius: 50px;
          border: none;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          transition: all 0.25s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .btn-teal {
          background: linear-gradient(135deg, #0d7377, #14919b);
          color: white;
          box-shadow: 0 4px 16px rgba(13,115,119,0.3);
        }

        .btn-teal:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,115,119,0.4); }

        .btn-orange {
          background: linear-gradient(135deg, #ff6b35, #ff8c5a);
          color: white;
          box-shadow: 0 4px 16px rgba(255,107,53,0.3);
        }

        .btn-orange:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,53,0.4); }

        .btn-magenta {
          background: linear-gradient(135deg, #d63384, #e91e63);
          color: white;
          box-shadow: 0 4px 16px rgba(214,51,132,0.3);
        }

        .btn-magenta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(214,51,132,0.4); }

        .btn-ghost {
          background: transparent;
          color: #5a7a7c;
          border: 2px solid #e8dfd0;
        }

        .btn-ghost:hover { background: #fdf6ec; border-color: #0d7377; color: #0d7377; }

        .btn-sm { padding: 7px 14px; font-size: 11px; }
        .btn-icon { padding: 8px; border-radius: 10px; width: 34px; height: 34px; }
        .btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; box-shadow: 0 4px 16px rgba(239,68,68,0.3); }
        .btn-success { background: linear-gradient(135deg, #10b981, #059669); color: white; box-shadow: 0 4px 16px rgba(16,185,129,0.3); }

        /* Upload area */
        .upload-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 32px 20px;
          border-radius: 14px;
          border: 2.5px dashed;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          text-align: center;
        }

        .upload-area:hover { opacity: 0.85; }

        /* Projects grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }

        @media (max-width: 640px) {
          .projects-grid { grid-template-columns: 1fr; }
        }

        /* Gallery grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }

        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1200px) {
          .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
        }

        /* Plot types grid */
        .plot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        @media (max-width: 480px) {
          .plot-grid { grid-template-columns: 1fr; }
        }

        /* Advantage grid */
        .advantage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }

        @media (max-width: 480px) {
          .advantage-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Slides list */
        .slide-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid #e8dfd0;
          background: #fefaf4;
          flex-wrap: wrap;
          transition: border-color 0.2s;
        }

        .slide-item.active { border-color: #ff6b35; background: rgba(255,107,53,0.04); }

        .slide-thumb {
          width: 80px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .slide-thumb { width: 64px; height: 42px; }
        }

        /* Contacts table */
        .contacts-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .contacts-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          min-width: 700px;
        }

        .contacts-table th {
          padding: 12px 14px;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          color: #0d7377;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: #fdf6ec;
          border-bottom: 2px solid #e8dfd0;
          white-space: nowrap;
        }

        .contacts-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e8dfd0;
          vertical-align: middle;
          color: #2d4647;
        }

        .contacts-table tr:hover td { background: rgba(13,115,119,0.02); }

        /* Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
          border: 2px solid white;
        }

        /* Nav menu item */
       .nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.75);
  font-size: 17px;       
  font-weight: 600;      
  cursor: pointer;
  width: 100%;
  text-align: left;
  border-left: 3px solid transparent;
  transition: all 0.2s;
  font-family: 'Poppins', sans-serif;
  position: relative;
}
        .nav-item:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .nav-item.active {
          background: rgba(255,107,53,0.15);
          color: #ff8c5a;
          border-left-color: #ff6b35;
          font-weight: 700;
        }

        .nav-badge {
          margin-left: auto;
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Hero page tabs */
        .hero-page-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .hero-tab {
          position: relative;
          padding: 9px 20px;
          border-radius: 50px;
          border: 2px solid;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          text-transform: capitalize;
          transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
        }

        /* Gallery type buttons */
        .gallery-type-btn {
          flex: 1;
          min-width: 110px;
          padding: 13px 12px;
          border-radius: 12px;
          border: 2px solid;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
        }

        /* Amenity/highlight row */
        .list-row {
          background: white;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 8px;
          border: 1px solid #e8dfd0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .list-row-top {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        /* Welcome banner */
        .welcome-banner {
          background: linear-gradient(135deg, #0d7377, #14919b);
          border-radius: 20px;
          padding: clamp(20px, 4vw, 32px);
          margin-bottom: 20px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .welcome-deco {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,107,53,0.15);
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 52px;
          margin-bottom: 12px;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #fdf6ec; }
        ::-webkit-scrollbar-thumb { background: #14919b; border-radius: 3px; }

        /* Input row */
        .input-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .input-row > .form-input { flex: 1; }

        /* Image preview */
        .img-preview {
          position: relative;
          display: inline-block;
        }

        .img-preview img {
          display: block;
          border-radius: 10px;
          object-fit: cover;
        }

        .img-remove {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #d63384;
          border: 2.5px solid white;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* Tab content */
        .tab-content {
          padding: clamp(14px, 3vw, 24px);
          flex: 1;
        }

        /* Animate fade in */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in { animation: fadeIn 0.25s ease; }

        /* Project card */
        .project-card {
          border-radius: 16px;
          overflow: hidden;
          border: 1.5px solid #e8dfd0;
          background: white;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(13,115,119,0.14);
          border-color: #14919b;
        }

        /* Slider controls row */
        .slide-controls {
          display: flex;
          gap: 5px;
          align-items: center;
          margin-left: auto;
          flex-wrap: wrap;
        }

        @media (max-width: 420px) {
          .slide-controls { width: 100%; justify-content: flex-end; }
        }

        /* Settings bar */
        .settings-bar {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        /* Contacts stats */
        .contact-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        @media (max-width: 480px) {
          .contact-stat-grid { grid-template-columns: 1fr; gap: 8px; }
        }

        /* Form actions */
        .form-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: 8px;
        }

        /* Sidebar logo */
        .sidebar-logo {
  padding: 20px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.1);
}
.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b35, #ff8c5a);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(255,107,53,0.4);
  overflow: hidden;
}


        .sidebar-nav {
          flex: 1;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow-y: auto;
        }

        .sidebar-footer {
          padding: 14px 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .admin-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 6px;
          background: #fdf6ec;
          border: 1px solid #e8dfd0;
          border-radius: 50px;
        }

        .admin-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b35, #ff8c5a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .admin-chip span { display: none; }
          .admin-chip { padding: 4px; }
        }

        /* Hero page count badge */
        .page-count {
          position: absolute;
          top: -7px;
          right: -7px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6b0303;
          color: white;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }
      `}</style>

      <div className="admin-layout">
        {/* SIDEBAR OVERLAY (mobile) */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
<div className="sidebar-logo">
  <img 
    src="/logooo.png" 
    alt="Akshaya Builders & Developers Admin Panel" 
    style={{ 
      width: '100%', 
      maxWidth: '180px',
      height: 'auto',
      objectFit: 'contain',
      display: 'block',
      margin: '0 auto',
    }} 
  />
</div>


          <nav className="sidebar-nav">
            {menuItems.map(item => (
              <button
                key={item.key}
                className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.key);
                  setSidebarOpen(false);
                  if (item.key === 'projects') setProjectView('list');
                }}
              >
                <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span
                    className="nav-badge"
                    style={{ background: item.alert ? '#d63384' : 'rgba(255,107,53,0.25)', color: item.alert ? 'white' : '#ffb797' }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <Link href="/" target="_blank" style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '10px 14px', borderRadius: '10px',
              color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.07)',
              textDecoration: 'none', fontSize: '12px', fontWeight: '600',
              transition: 'background 0.2s',
            }}>
              <FaHome size={13} /> View Website
            </Link>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '10px 14px', borderRadius: '10px',
              color: 'white',
              background: 'linear-gradient(135deg, #d63384, #e91e63)',
              border: 'none', fontSize: '12px', cursor: 'pointer',
              fontWeight: '700', fontFamily: "'Poppins', sans-serif",
              width: '100%', boxShadow: '0 4px 14px rgba(214,51,132,0.35)',
            }}>
              <FaSignOutAlt size={13} /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          {/* TOPBAR */}
          <header className="topbar">
            <div className="topbar-left">
              <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
              <div>
                <div className="page-title">
                  {activeTab === 'dashboard' && '📊 Dashboard'}
                  {activeTab === 'hero' && '🖥️ Hero Sections'}
                  {activeTab === 'plot-types' && '🏠 Plot Types'}
                  {activeTab === 'advantage' && '⭐ Advantage Images'}
                  {activeTab === 'projects' && (projectView === 'detail' ? (editingProject ? '✏️ Edit Project' : '➕ New Project') : '🏗️ Projects')}
                  {activeTab === 'gallery' && '🖼️ Gallery'}
                  {activeTab === 'contacts' && '📬 Messages'}
                </div>
                <div className="page-sub">
                  {activeTab === 'dashboard' && 'Welcome back, Admin!'}
                  {activeTab === 'hero' && `Managing: ${selectedHeroPage} · ${heroSlides.length} slides`}
                  {activeTab === 'plot-types' && `${plotTypes.length} plot types`}
                  {activeTab === 'advantage' && `${advantageImages.length} images`}
                  {activeTab === 'projects' && (projectView === 'list' ? `${projects.length} projects · click to edit` : 'Fill details below')}
                  {activeTab === 'gallery' && `${gallery.filter(g => !['plot-type','advantage'].includes(g.category)).length} items`}
                  {activeTab === 'contacts' && `${contacts.filter(c => !c.isRead).length} unread`}
                </div>
              </div>
            </div>

            <div className="topbar-right">
              {activeTab === 'projects' && projectView === 'list' && (
                <button className="btn btn-teal btn-sm" onClick={() => openProjectDetail(null)}>
                  <FaPlus size={10} /> Add Project
                </button>
              )}
              {activeTab === 'projects' && projectView === 'detail' && (
                <button className="btn btn-ghost btn-sm" onClick={() => { setProjectView('list'); resetProjectForm(); }}>
                  <FaArrowLeft size={10} /> Back
                </button>
              )}
              <div className="admin-chip">
                <div className="admin-avatar">A</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#2d4647' }}>Admin</span>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="tab-content fade-in" key={activeTab}>

            {/* ===== DASHBOARD ===== */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="welcome-banner">
                  <div className="welcome-deco" style={{ width: 180, height: 180, top: -60, right: -40 }} />
                  <div className="welcome-deco" style={{ width: 100, height: 100, bottom: -40, right: 120, opacity: 0.5 }} />
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
                      Good Day, Admin! 👋
                    </h1>
                    <p style={{ opacity: 0.9, fontSize: 'clamp(12px,2vw,14px)' }}>
                      Here&apos;s your website overview at a glance.
                    </p>
                  </div>
                </div>

                <div className="stat-grid">
                  {[
                    { label: 'Hero Slides', val: heroes.reduce((s, h) => s + (h.slides?.length || 0), 0), color: C.orange, bg: 'rgba(255,107,53,0.1)', key: 'hero', icon: <FaDesktop /> },
                    { label: 'Plot Types', val: plotTypes.length, color: C.magenta, bg: 'rgba(214,51,132,0.1)', key: 'plot-types', icon: <FaTh /> },
                    { label: 'Advantage', val: advantageImages.length, color: C.tealLight, bg: 'rgba(20,145,155,0.1)', key: 'advantage', icon: <FaStar /> },
                    { label: 'Projects', val: projects.length, color: C.teal, bg: 'rgba(13,115,119,0.1)', key: 'projects', icon: <FaBuilding /> },
                    { label: 'Gallery', val: gallery.filter(g => !['plot-type','advantage'].includes(g.category)).length, color: C.info, bg: 'rgba(59,130,246,0.1)', key: 'gallery', icon: <FaImage /> },
                    { label: 'Unread Msgs', val: contacts.filter(c => !c.isRead).length, color: C.danger, bg: 'rgba(239,68,68,0.1)', key: 'contacts', icon: <FaEnvelope />, alert: true },
                  ].map((s, i) => (
                    <div key={i} className="stat-card" onClick={() => { setActiveTab(s.key); if (s.key === 'projects') setProjectView('list'); }}>
                      <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                        {s.icon}
                      </div>
                      <div>
                        <div className="stat-num" style={{ color: s.color }}>{s.val}</div>
                        <div className="stat-label">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent contacts */}
                {contacts.filter(c => !c.isRead).length > 0 && (
                  <div className="card">
                    <div className="card-header">
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>🔔 New Messages</div>
                      <button className="btn btn-sm btn-ghost" onClick={() => setActiveTab('contacts')}>View All</button>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                      {contacts.filter(c => !c.isRead).slice(0, 3).map(c => (
                        <div key={c._id} style={{
                          padding: '14px 18px',
                          borderBottom: `1px solid ${C.border}`,
                          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                        }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,107,53,0.12)', color: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                            {c.name?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: C.textLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</div>
                          </div>
                          <div style={{ fontSize: 11, color: C.textLight, flexShrink: 0 }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== HERO ===== */}
            {activeTab === 'hero' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Page select */}
                <div className="card">
                  <div className="card-header">
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>📄 Select Page</div>
                  </div>
                  <div className="card-body">
                    <div className="hero-page-tabs">
                      {['home','about','projects','gallery','contact'].map(p => {
                        const count = heroes.find(h => h.page === p)?.slides?.length || 0;
                        const isActive = selectedHeroPage === p;
                        return (
                          <button key={p} className="hero-tab" onClick={() => loadHeroForPage(p)} style={{
                            borderColor: isActive ? C.orange : C.border,
                            background: isActive ? `linear-gradient(135deg, ${C.orange}, ${C.orangeLight})` : C.white,
                            color: isActive ? C.white : C.teal,
                          }}>
                            {p}
                            {count > 0 && <span className="page-count">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick upload */}
                <div className="card" style={{ border: `2px solid ${C.orange}` }}>
                  <div className="card-header">
                    <div>
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>🚀 Quick Upload</div>
                      <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>Upload multiple images/videos at once</div>
                    </div>
                    <div style={{
                      padding: '5px 14px', background: C.orange, color: 'white',
                      borderRadius: 50, fontSize: 12, fontWeight: 700,
                    }}>
                      {heroSlides.length}/10
                    </div>
                  </div>
                  <div className="card-body">
                    <label className="upload-area" style={{ borderColor: C.orange, color: C.orange, background: 'rgba(255,107,53,0.05)', cursor: bulkUploading ? 'not-allowed' : 'pointer' }}>
                      <FaUpload size={26} />
                      <div style={{ fontWeight: 700 }}>{bulkUploading ? '⏳ Uploading…' : 'Click to select multiple files'}</div>
                      <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 500 }}>Images & Videos supported · Max 10 slides</div>
                      <input type="file" accept="image/*,video/mp4,video/webm" multiple disabled={bulkUploading} onChange={handleQuickUploadAndSave} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                {/* Settings + save */}
                <div className="card">
                  <div className="card-body" style={{ padding: '14px 18px' }}>
                    <div className="settings-bar">
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                        ⚙️ <span style={{ color: C.orange, textTransform: 'capitalize' }}>{selectedHeroPage}</span> Settings
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                          value={autoScrollSeconds}
                          onChange={e => setAutoScrollSeconds(+e.target.value)}
                          className="form-input"
                          style={{ width: 'auto', padding: '8px 12px' }}
                        >
                          {[3,5,7,10].map(n => <option key={n} value={n}>{n} seconds</option>)}
                        </select>
                        <button className="btn btn-magenta" onClick={saveAllSlides}>
                          💾 Save All ({heroSlides.length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slides list */}
                <div className="card">
                  <div className="card-header">
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>🎬 Slides ({heroSlides.length})</div>
                  </div>
                  <div className="card-body">
                    {heroSlides.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">🎬</div>
                        <p style={{ color: C.textLight, fontSize: 14 }}>No slides yet. Upload above to get started.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {heroSlides.map((slide, idx) => (
                          <div key={idx} className={`slide-item ${editingSlideIndex === idx ? 'active' : ''}`}>
                            <div style={{
                              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                              background: `linear-gradient(135deg, ${C.orange}, ${C.orangeLight})`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: 800, fontSize: 16,
                            }}>{idx + 1}</div>

                            {slide.mediaType === 'video'
                              ? <video src={slide.mediaUrl} className="slide-thumb" style={{ background: '#000' }} />
                              : <img src={slide.mediaUrl} alt="" className="slide-thumb" />
                            }

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {slide.title || `Slide ${idx + 1}`}
                              </div>
                              <div style={{ fontSize: 11, color: C.textLight, textTransform: 'capitalize' }}>
                                {slide.mediaType}
                              </div>
                            </div>

                            <div className="slide-controls">
                              <button
                                className="btn btn-icon"
                                disabled={idx === 0}
                                onClick={() => moveSlide(idx, 'up')}
                                style={{ background: idx === 0 ? C.border : C.teal, color: 'white', border: 'none' }}
                              ><FaArrowUp size={11} /></button>
                              <button
                                className="btn btn-icon"
                                disabled={idx === heroSlides.length - 1}
                                onClick={() => moveSlide(idx, 'down')}
                                style={{ background: idx === heroSlides.length - 1 ? C.border : C.teal, color: 'white', border: 'none' }}
                              ><FaArrowDown size={11} /></button>
                              <button
                                className="btn btn-icon btn-danger"
                                onClick={() => removeSlide(idx)}
                              ><FaTrash size={11} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== PLOT TYPES ===== */}
            {activeTab === 'plot-types' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="card" style={{ borderLeft: `4px solid ${C.magenta}` }}>
                  <div className="card-header">
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>
                      {editingPlotType ? '✏️ Edit Plot Type' : '➕ Add Plot Type'}
                    </div>
                    {editingPlotType && (
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditingPlotType(null); setPlotTypeForm({ title: '', description: '', imageUrl: '' }); }}>
                        Cancel
                      </button>
                    )}
                  </div>
                  <div className="card-body">
                    <form onSubmit={handlePlotTypeSubmit}>
                      <div className="form-grid-2" style={{ marginBottom: 12 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Title *</label>
                          <input className="form-input" placeholder="e.g. Residential Plots" value={plotTypeForm.title} onChange={e => setPlotTypeForm({ ...plotTypeForm, title: e.target.value })} required />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Description</label>
                          <input className="form-input" placeholder="Short description" value={plotTypeForm.description} onChange={e => setPlotTypeForm({ ...plotTypeForm, description: e.target.value })} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Image *</label>
                        <label className="upload-area" style={{ borderColor: C.magenta, color: C.magenta, background: 'rgba(214,51,132,0.04)', padding: '24px' }}>
                          <FaUpload size={20} />
                          <span style={{ fontSize: 13 }}>{uploading ? 'Uploading…' : 'Click to upload image'}</span>
                          <input type="file" accept="image/*" onChange={e => handleUpload(e, d => setPlotTypeForm(p => ({ ...p, imageUrl: d.url })))} style={{ display: 'none' }} />
                        </label>
                        {plotTypeForm.imageUrl && (
                          <div className="img-preview" style={{ marginTop: 10 }}>
                            <img src={plotTypeForm.imageUrl} alt="" style={{ width: 160, height: 110, borderRadius: 10, objectFit: 'cover' }} />
                            <button type="button" className="img-remove" onClick={() => setPlotTypeForm({ ...plotTypeForm, imageUrl: '' })}>×</button>
                          </div>
                        )}
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn btn-magenta">{editingPlotType ? '💾 Update' : '✨ Save'}</button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>🏠 Plot Types ({plotTypes.length})</div>
                  </div>
                  <div className="card-body">
                    {plotTypes.length === 0 ? (
                      <div className="empty-state"><div className="empty-icon">🏠</div><p style={{ color: C.textLight }}>No plot types yet</p></div>
                    ) : (
                      <div className="plot-grid">
                        {plotTypes.map(p => (
                          <div key={p._id} style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${C.border}`, background: C.white, boxShadow: '0 3px 12px rgba(0,0,0,0.06)' }}>
                            <div style={{ height: 160, background: `url(${p.imageUrl}) center/cover` }} />
                            <div style={{ padding: 14 }}>
                              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: C.text }}>{p.title}</h4>
                              <p style={{ color: C.textLight, fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>{p.description}</p>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-orange btn-sm" style={{ flex: 1 }} onClick={() => { setEditingPlotType(p); setPlotTypeForm({ title: p.title, description: p.description || '', imageUrl: p.imageUrl }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                  <FaEdit size={10} /> Edit
                                </button>
                                <button className="btn btn-danger btn-sm btn-icon" onClick={async () => { if (!confirm('Delete?')) return; await fetch(`/api/gallery?id=${p._id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchGallery(); }}>
                                  <FaTrash size={10} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== ADVANTAGE ===== */}
            {activeTab === 'advantage' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="card" style={{ border: `2px solid ${C.teal}` }}>
                  <div className="card-header">
                    <div>
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>🚀 Upload Advantage Images</div>
                      <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>Auto-scrolling images on homepage</div>
                    </div>
                  </div>
                  <div className="card-body">
                    <label className="upload-area" style={{ borderColor: C.teal, color: C.teal, background: 'rgba(13,115,119,0.05)', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                      <FaUpload size={26} />
                      <div style={{ fontWeight: 700 }}>{uploading ? '⏳ Uploading…' : 'Click to select multiple images'}</div>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>Multiple files supported</div>
                      <input type="file" accept="image/*" multiple disabled={uploading} onChange={handleAdvantageBulkUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>⭐ Current Images ({advantageImages.length})</div>
                  </div>
                  <div className="card-body">
                    {advantageImages.length === 0 ? (
                      <div className="empty-state"><div className="empty-icon">⭐</div><p style={{ color: C.textLight }}>No images yet</p></div>
                    ) : (
                      <div className="advantage-grid">
                        {advantageImages.map(g => (
                          <div key={g._id} style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', border: `1px solid ${C.border}`, background: C.white }}>
                            <div style={{ height: 130, background: `url(${g.imageUrl}) center/cover` }} />
                            <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</span>
                              <button
                                onClick={async () => { if (!confirm('Delete?')) return; await fetch(`/api/gallery?id=${g._id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchGallery(); }}
                                style={{ background: C.danger, border: 'none', borderRadius: 7, padding: '5px 8px', color: 'white', cursor: 'pointer', flexShrink: 0 }}
                              ><FaTrash size={10} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== PROJECTS ===== */}
            {activeTab === 'projects' && (
              <div>
                {projectView === 'list' && (
                  <div className="card">
                    <div className="card-header">
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>📋 All Projects ({projects.length})</div>
                    </div>
                    <div className="card-body">
                      {projects.length === 0 ? (
                        <div className="empty-state">
                          <div className="empty-icon">🏗️</div>
                          <p style={{ color: C.textLight, marginBottom: 16 }}>No projects yet</p>
                          <button className="btn btn-teal" onClick={() => openProjectDetail(null)}><FaPlus size={11} /> Add First</button>
                        </div>
                      ) : (
                        <div className="projects-grid">
                          {projects.map(p => (
                            <div key={p._id} className="project-card" onClick={() => openProjectDetail(p)}>
                              <div style={{
                                height: 150,
                                background: p.heroImage || p.images?.[0]
                                  ? `url(${p.heroImage || p.images[0]}) center/cover`
                                  : `linear-gradient(135deg, ${C.teal}, ${C.tealLight})`,
                                position: 'relative',
                              }}>
                                <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
                                  <FaMapMarkerAlt size={8} style={{ marginRight: 4 }} />{p.location}
                                </div>
                              </div>
                              <div style={{ padding: 14 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>{p.title}</h3>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <button
                                    className="btn btn-orange btn-sm"
                                    style={{ flex: 1 }}
                                    onClick={e => { e.stopPropagation(); openProjectDetail(p); }}
                                  ><FaEdit size={10} /> Edit</button>
                                  <button
                                    className="btn btn-danger btn-sm btn-icon"
                                    onClick={e => { e.stopPropagation(); deleteProject(p._id); }}
                                  ><FaTrash size={10} /></button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {projectView === 'detail' && (
                  <div className="card" style={{ border: `2px solid ${C.teal}` }}>
                    <div className="card-header">
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>
                        {editingProject ? `✏️ ${editingProject.title}` : '➕ New Project'}
                      </div>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleProjectSubmit}>

                        {/* 1 Basic */}
                        <div className="section-box" style={{ borderLeft: `4px solid ${C.teal}` }}>
                          <div className="section-label" style={{ color: C.teal }}>1️⃣ Basic Info</div>
                          <div className="form-grid-2">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Title *</label>
                              <input className="form-input" placeholder="Project Title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">📍 Location *</label>
                              <input className="form-input" placeholder="Location" value={projectForm.location} onChange={e => setProjectForm({ ...projectForm, location: e.target.value })} required />
                            </div>
                          </div>
                          <div className="form-group" style={{ marginTop: 12, marginBottom: 0 }}>
                            <label className="form-label">Short Description</label>
                            <textarea className="form-input form-textarea" rows={2} placeholder="Brief description…" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
                          </div>
                        </div>

                        {/* 2 Hero Image */}
                        <div className="section-box" style={{ borderLeft: `4px solid ${C.orange}` }}>
                          <div className="section-label" style={{ color: C.orange }}>2️⃣ Hero Image</div>
                          <label className="upload-area" style={{ borderColor: C.orange, color: C.orange, background: 'rgba(255,107,53,0.05)', padding: 20, fontSize: 13 }}>
                            <FaUpload size={18} />
                            {uploading ? 'Uploading…' : '📂 Upload Hero Image'}
                            <input type="file" accept="image/*" disabled={uploading} onChange={e => handleUpload(e, d => setProjectForm(p => ({ ...p, heroImage: d.url })))} style={{ display: 'none' }} />
                          </label>
                          {projectForm.heroImage && (
                            <div style={{ marginTop: 10, position: 'relative' }}>
                              <img src={projectForm.heroImage} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
                              <button type="button" onClick={() => setProjectForm({ ...projectForm, heroImage: '' })} style={{ position: 'absolute', top: 8, right: 8, background: C.danger, border: 'none', borderRadius: 7, padding: '5px 10px', color: 'white', cursor: 'pointer' }}><FaTrash size={10} /></button>
                            </div>
                          )}
                        </div>

                        {/* 3 About */}
                        <div className="section-box" style={{ borderLeft: `4px solid ${C.success}` }}>
                          <div className="section-label" style={{ color: C.success }}>3️⃣ About Project</div>
                          <textarea className="form-input form-textarea" style={{ minHeight: 160 }} placeholder="Write detailed description…" value={projectForm.about} onChange={e => setProjectForm({ ...projectForm, about: e.target.value })} rows={7} />
                        </div>

                        {/* 4 Video */}
                        <div className="section-box" style={{ borderLeft: `4px solid ${C.magenta}` }}>
                          <div className="section-label" style={{ color: C.magenta }}>4️⃣ Video</div>
                          <label className="upload-area" style={{ borderColor: C.magenta, color: C.magenta, background: 'rgba(214,51,132,0.04)', padding: 18, fontSize: 13 }}>
                            <FaPlayCircle size={20} />
                            {uploading ? 'Uploading…' : '🎬 Upload Video'}
                            <input type="file" accept="video/*" disabled={uploading} onChange={e => handleUpload(e, d => setProjectForm(p => ({ ...p, video: d.url })))} style={{ display: 'none' }} />
                          </label>
                          {projectForm.video && (
                            <div style={{ marginTop: 10, position: 'relative' }}>
                              <video src={projectForm.video} controls style={{ width: '100%', maxHeight: 180, display: 'block', borderRadius: 10 }} />
                              <button type="button" onClick={() => setProjectForm({ ...projectForm, video: '' })} style={{ position: 'absolute', top: 8, right: 8, background: C.danger, border: 'none', borderRadius: 7, padding: '5px 10px', color: 'white', cursor: 'pointer' }}><FaTrash size={10} /></button>
                            </div>
                          )}
                        </div>

                        {/* 5 Amenities */}
                        <div className="section-box" style={{ borderLeft: `4px solid ${C.tealLight}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div className="section-label" style={{ color: C.tealLight, marginBottom: 0 }}>5️⃣ Amenities ({projectForm.amenities.length})</div>
                            <button type="button" className="btn btn-sm" style={{ background: C.tealLight, color: 'white' }} onClick={() => setProjectForm(p => ({ ...p, amenities: [...p.amenities, { title: '', description: '', icon: 'check' }] }))}>
                              <FaPlus size={9} /> Add
                            </button>
                          </div>
                          {projectForm.amenities.map((am, i) => (
                            <div key={i} className="list-row">
                              <div className="list-row-top">
                                <input className="form-input" style={{ flex: 2 }} placeholder="Title" value={am.title} onChange={e => { const l = [...projectForm.amenities]; l[i].title = e.target.value; setProjectForm(p => ({ ...p, amenities: l })); }} />
                                <select className="form-input" style={{ flex: 1 }} value={am.icon} onChange={e => { const l = [...projectForm.amenities]; l[i].icon = e.target.value; setProjectForm(p => ({ ...p, amenities: l })); }}>
                                  {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                                <button type="button" className="btn btn-danger btn-icon btn-sm" onClick={() => setProjectForm(p => ({ ...p, amenities: p.amenities.filter((_, j) => j !== i) }))}>
                                  <FaTrash size={10} />
                                </button>
                              </div>
                              <input className="form-input" placeholder="Description" value={am.description} onChange={e => { const l = [...projectForm.amenities]; l[i].description = e.target.value; setProjectForm(p => ({ ...p, amenities: l })); }} />
                            </div>
                          ))}
                        </div>

                        {/* 6 Highlights */}
                        <div className="section-box" style={{ borderLeft: `4px solid ${C.success}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div className="section-label" style={{ color: C.success, marginBottom: 0 }}>6️⃣ Highlights ({projectForm.highlights.length})</div>
                            <button type="button" className="btn btn-sm" style={{ background: C.success, color: 'white' }} onClick={() => setProjectForm(p => ({ ...p, highlights: [...p.highlights, { title: '', description: '', icon: 'check' }] }))}>
                              <FaPlus size={9} /> Add
                            </button>
                          </div>
                          {projectForm.highlights.map((h, i) => (
                            <div key={i} className="list-row">
                              <div className="list-row-top">
                                <input className="form-input" style={{ flex: 2 }} placeholder="Title" value={h.title} onChange={e => { const l = [...projectForm.highlights]; l[i].title = e.target.value; setProjectForm(p => ({ ...p, highlights: l })); }} />
                                <select className="form-input" style={{ flex: 1 }} value={h.icon} onChange={e => { const l = [...projectForm.highlights]; l[i].icon = e.target.value; setProjectForm(p => ({ ...p, highlights: l })); }}>
                                  {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                                <button type="button" className="btn btn-danger btn-icon btn-sm" onClick={() => setProjectForm(p => ({ ...p, highlights: p.highlights.filter((_, j) => j !== i) }))}>
                                  <FaTrash size={10} />
                                </button>
                              </div>
                              <input className="form-input" placeholder="Description" value={h.description} onChange={e => { const l = [...projectForm.highlights]; l[i].description = e.target.value; setProjectForm(p => ({ ...p, highlights: l })); }} />
                            </div>
                          ))}
                        </div>

                        {/* 7 Location */}
                       {/* 🔟 ✅ BROCHURE PDF UPLOAD - NEW */}
<div className="section-box" style={{ borderLeft: `4px solid ${C.info}` }}>
  <div className="section-label" style={{ color: C.info }}>
    🔟 Project Brochure PDF (For Lead Download)
  </div>
  
  <label className="upload-area" style={{
    borderColor: C.info,
    color: C.info,
    background: 'rgba(59,130,246,0.05)',
    padding: 20,
    fontSize: 13,
    cursor: uploading ? 'not-allowed' : 'pointer',
  }}>
    <span style={{ fontSize: 28 }}>📄</span>
    <div style={{ fontWeight: 700 }}>
      {uploading ? '⏳ Uploading PDF...' : '📂 Upload Brochure PDF'}
    </div>
    <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 500 }}>
      PDF files only · This will be sent to leads when they fill the form
    </div>
    <input
      type="file"
      accept="application/pdf,.pdf"
      disabled={uploading}
      onChange={e => handleUpload(e, d => setProjectForm(p => ({ ...p, brochurePdf: d.url })))}
      style={{ display: 'none' }}
    />
  </label>

  {projectForm.brochurePdf && (
    <div style={{
      marginTop: 12,
      padding: 14,
      background: 'rgba(59,130,246,0.08)',
      borderRadius: 12,
      border: `1.5px solid ${C.info}`,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
    }}>
      <div style={{
        width: 44, height: 44,
        background: C.info,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 20,
        flexShrink: 0,
      }}>📄</div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 2 }}>
          ✅ Brochure Uploaded
        </div>
        <a 
          href={projectForm.brochurePdf} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: C.info, 
            fontSize: 11, 
            fontWeight: 600, 
            textDecoration: 'underline',
            wordBreak: 'break-all',
          }}
        >
          View PDF
        </a>
      </div>
      
      <button 
        type="button"
        onClick={() => setProjectForm({ ...projectForm, brochurePdf: '' })}
        className="btn btn-danger btn-sm"
        style={{ flexShrink: 0 }}
      >
        <FaTrash size={10} /> Remove
      </button>
    </div>
  )}
</div>

                        {/* 8 Gallery images */}
                        <div className="section-box" style={{ borderLeft: `4px solid ${C.teal}` }}>
                          <div className="section-label" style={{ color: C.teal }}>8️⃣ Gallery Images ({projectForm.images.length})</div>
                          <label className="upload-area" style={{ borderColor: C.teal, color: C.teal, background: 'rgba(13,115,119,0.04)', padding: 18, fontSize: 13 }}>
                            <FaUpload size={18} />
                            {uploading ? 'Uploading…' : '📂 Upload Gallery Image'}
                            <input type="file" accept="image/*" disabled={uploading} onChange={e => handleUpload(e, d => setProjectForm(p => ({ ...p, images: [...p.images, d.url] })))} style={{ display: 'none' }} />
                          </label>
                          {projectForm.images.length > 0 && (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                              {projectForm.images.map((img, i) => (
                                <div key={i} className="img-preview">
                                  <img src={img} alt="" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
                                  <button type="button" className="img-remove" onClick={() => setProjectForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}>×</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 9 CTA Image */}
                        <div className="section-box" style={{ borderLeft: `4px solid ${C.danger}` }}>
                          <div className="section-label" style={{ color: C.danger }}>9️⃣ CTA Image</div>
                          <label className="upload-area" style={{ borderColor: C.danger, color: C.danger, background: 'rgba(239,68,68,0.04)', padding: 18, fontSize: 13 }}>
                            <FaUpload size={18} />
                            {uploading ? 'Uploading…' : '📂 Upload CTA Image'}
                            <input type="file" accept="image/*" disabled={uploading} onChange={e => handleUpload(e, d => setProjectForm(p => ({ ...p, ctaImage: d.url })))} style={{ display: 'none' }} />
                          </label>
                          {projectForm.ctaImage && (
                            <div style={{ marginTop: 10, position: 'relative' }}>
                              <img src={projectForm.ctaImage} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
                              <button type="button" onClick={() => setProjectForm({ ...projectForm, ctaImage: '' })} style={{ position: 'absolute', top: 8, right: 8, background: C.danger, border: 'none', borderRadius: 7, padding: '5px 10px', color: 'white', cursor: 'pointer' }}><FaTrash size={10} /></button>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="form-actions" style={{ marginTop: 20 }}>
                          <button type="submit" className="btn btn-teal" style={{ padding: '12px 36px', fontSize: 13 }}>
                            {editingProject ? '💾 Update Project' : '✨ Save Project'}
                          </button>
                          <button type="button" className="btn btn-ghost" onClick={() => { setProjectView('list'); resetProjectForm(); }}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== GALLERY ===== */}
            {activeTab === 'gallery' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="card" style={{ borderLeft: `4px solid ${C.orange}` }}>
                  <div className="card-header">
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>➕ Add Gallery Item</div>
                  </div>
                  <div className="card-body">
                    {/* Type buttons */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
                      {[
                        { type: 'image', label: 'Upload Image', icon: <FaImage />, color: C.orange },
                        { type: 'youtube', label: 'YouTube Video', icon: <FaPlayCircle />, color: '#ff0000' },
                        { type: 'best-property', label: '🏆 Best Property', icon: null, color: '#f39c12' },
                      ].map(btn => (
                        <button
                          key={btn.type}
                          type="button"
                          className="gallery-type-btn"
                          onClick={() => setGalleryForm(p => ({ ...p, uploadType: btn.type, imageUrl: '', youtubeUrl: '', youtubeId: '' }))}
                          style={{
                            borderColor: galleryForm.uploadType === btn.type ? btn.color : C.border,
                            background: galleryForm.uploadType === btn.type ? btn.color : C.white,
                            color: galleryForm.uploadType === btn.type ? 'white' : C.text,
                          }}
                        >
                          {btn.icon} {btn.label}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleGallerySubmit}>
                      {/* Image upload */}
                      {(galleryForm.uploadType === 'image' || galleryForm.uploadType === 'best-property') && (
                        <>
                          <label
                            className="upload-area"
                            style={{
                              borderColor: galleryForm.uploadType === 'best-property' ? '#f39c12' : C.orange,
                              color: galleryForm.uploadType === 'best-property' ? '#f39c12' : C.orange,
                              background: galleryForm.uploadType === 'best-property' ? 'rgba(243,156,18,0.05)' : 'rgba(255,107,53,0.05)',
                              marginBottom: 14,
                            }}
                          >
                            <FaUpload size={24} />
                            <div style={{ fontWeight: 700 }}>
                              {uploading ? '⏳ Uploading…' : galleryForm.uploadType === 'best-property' ? '🏆 Upload Best Property Image' : '📂 Click to Upload Image'}
                            </div>
                            <input type="file" accept="image/*" onChange={e => handleUpload(e, d => setGalleryForm(p => ({ ...p, imageUrl: d.url })))} style={{ display: 'none' }} />
                          </label>
                          {galleryForm.imageUrl && (
                            <div className="img-preview" style={{ marginBottom: 14 }}>
                              <img src={galleryForm.imageUrl} alt="" style={{ width: 220, height: 150, borderRadius: 12, objectFit: 'cover', border: `2px solid ${galleryForm.uploadType === 'best-property' ? '#f39c12' : C.orange}` }} />
                              <button type="button" className="img-remove" onClick={() => setGalleryForm(p => ({ ...p, imageUrl: '' }))}>×</button>
                            </div>
                          )}
                        </>
                      )}

                      {/* YouTube */}
                      {galleryForm.uploadType === 'youtube' && (
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ padding: 18, borderRadius: 12, border: `2px dashed #ff0000`, background: 'rgba(255,0,0,0.04)', marginBottom: 14 }}>
                            <label className="form-label" style={{ color: '#ff0000', marginBottom: 8 }}>🎬 YouTube Video URL</label>
                            <input
                              className="form-input"
                              type="url"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={galleryForm.youtubeUrl}
                              onChange={e => {
                                const url = e.target.value;
                                const id = extractYouTubeId(url);
                                setGalleryForm(p => ({ ...p, youtubeUrl: url, youtubeId: id, imageUrl: id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '' }));
                              }}
                              style={{ borderColor: '#ff0000' }}
                            />
                          </div>
                          {galleryForm.youtubeId && (
                            <div style={{ position: 'relative', maxWidth: 320 }}>
                              <img src={`https://img.youtube.com/vi/${galleryForm.youtubeId}/maxresdefault.jpg`} alt="" style={{ width: '100%', borderRadius: 12, display: 'block', border: '2px solid #ff0000' }} />
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 12 }}>
                                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <FaPlayCircle size={30} color="white" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <button type="submit" className="btn" style={{
                        background: galleryForm.uploadType === 'best-property' ? 'linear-gradient(135deg,#f39c12,#f1c40f)' :
                          galleryForm.uploadType === 'youtube' ? 'linear-gradient(135deg,#ff0000,#cc0000)' :
                          `linear-gradient(135deg, ${C.magenta}, ${C.magentaLight})`,
                        color: 'white',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                      }}>
                        {galleryForm.uploadType === 'best-property' ? '🏆 Save Best Property' :
                          galleryForm.uploadType === 'youtube' ? '🎬 Save Video' : '✨ Save to Gallery'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Gallery grid */}
                <div className="card">
                  <div className="card-header">
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>
                      🖼️ Gallery Items ({gallery.filter(g => !['plot-type','advantage'].includes(g.category)).length})
                    </div>
                  </div>
                  <div className="card-body">
                    {gallery.filter(g => !['plot-type','advantage'].includes(g.category)).length === 0 ? (
                      <div className="empty-state"><div className="empty-icon">🖼️</div><p style={{ color: C.textLight }}>No items yet</p></div>
                    ) : (
                      <div className="gallery-grid">
                        {gallery.filter(g => !['plot-type','advantage'].includes(g.category)).map(g => (
                          <div key={g._id} style={{
                            borderRadius: 12, overflow: 'hidden', position: 'relative',
                            border: `1.5px solid ${C.border}`, background: C.white,
                            aspectRatio: '4/3',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                          }}>
                            <div style={{ width: '100%', height: '100%', background: g.imageUrl ? `url(${g.imageUrl}) center/cover` : C.orange, position: 'relative' }}>
                              {g.mediaType === 'youtube' && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaPlayCircle size={22} color="white" />
                                  </div>
                                </div>
                              )}
                              {/* Tag */}
                              <div style={{
                                position: 'absolute', bottom: 6, left: 6,
                                padding: '3px 8px', borderRadius: 6,
                                background: g.mediaType === 'youtube' ? '#ff0000' : g.category === 'best-property' ? '#f39c12' : C.orange,
                                color: 'white', fontSize: 9, fontWeight: 700,
                              }}>
                                {g.mediaType === 'youtube' ? '🎬 VIDEO' : g.category === 'best-property' ? '🏆 BEST' : '🖼️ IMG'}
                              </div>
                            </div>
                            <button onClick={() => deleteGalleryItem(g._id)} style={{
                              position: 'absolute', top: 6, right: 6,
                              background: C.danger, border: '2px solid white', borderRadius: '50%',
                              width: 28, height: 28, color: 'white', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}><FaTrash size={10} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== CONTACTS ===== */}
            {activeTab === 'contacts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="contact-stat-grid">
                  {[
                    { label: 'Total', val: contacts.length, color: C.teal, bg: 'rgba(13,115,119,0.1)', icon: '📬' },
                    { label: 'Unread', val: contacts.filter(c => !c.isRead).length, color: C.orange, bg: 'rgba(255,107,53,0.1)', icon: '🔔' },
                    { label: 'Read', val: contacts.filter(c => c.isRead).length, color: C.success, bg: 'rgba(16,185,129,0.1)', icon: '✅' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 16, padding: '18px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: 28 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: 10, color: C.textLight, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ borderLeft: `4px solid ${C.orange}` }}>
                  {contacts.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <h4 style={{ fontSize: 18, color: C.text, fontWeight: 700 }}>No Messages Yet</h4>
                    </div>
                  ) : (
                    <div className="contacts-table-wrap">
                      <table className="contacts-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Status</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map((c, i) => (
                            <tr key={c._id} style={{ background: c.isRead ? 'white' : 'rgba(255,107,53,0.03)' }}>
                              <td style={{ color: C.textLight, fontWeight: 600 }}>{i + 1}</td>
                              <td>
                                {c.isRead
                                  ? <span style={{ color: C.success, fontWeight: 700, fontSize: 12 }}>✅ Read</span>
                                  : <span style={{ color: C.orange, fontWeight: 700, fontSize: 12 }}>🔔 New</span>
                                }
                              </td>
                              <td style={{ fontWeight: 600, color: C.text }}>{c.name}</td>
                              <td style={{ color: C.textLight, fontSize: 12 }}>{c.email}</td>
                              <td style={{ color: C.textLight, fontSize: 12 }}>{c.phone}</td>
                              <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: C.textLight, fontSize: 12 }}>
                                {c.message}
                              </td>
                              <td style={{ color: C.textLight, fontSize: 12, whiteSpace: 'nowrap' }}>
                                {new Date(c.createdAt).toLocaleDateString()}
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                  {!c.isRead && (
                                    <button className="btn btn-success btn-icon btn-sm" onClick={() => markRead(c._id)} title="Mark as read">
                                      <FaEye size={10} />
                                    </button>
                                  )}
                                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteContact(c._id)} title="Delete">
                                    <FaTrash size={10} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
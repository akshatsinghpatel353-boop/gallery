import { useState } from "react";

import {
  Search,
  Upload,
  Heart,
  Menu,
  X,
  ArrowUpRight,
  Image as ImageIcon,
  Sparkles,
  Film,
  SlidersHorizontal,
  Download,
  Camera,
  ChevronRight
} from "lucide-react";

import ImageGenerator from "./components/ImageGenerator";

const initialImages = [
  {
    id: 1,
    title: "Urban Silence",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=900",
    height: "tall"
  },
  {
    id: 2,
    title: "Golden Hour",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900",
    height: "normal"
  },
  {
    id: 3,
    title: "Minimal Mood",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=900",
    height: "normal"
  },
  {
    id: 4,
    title: "Ocean Dreams",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900",
    height: "tall"
  },
  {
    id: 5,
    title: "Street Stories",
    category: "Street",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900",
    height: "normal"
  },
  {
    id: 6,
    title: "Soft Portrait",
    category: "Portrait",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900",
    height: "tall"
  },
  {
    id: 7,
    title: "Into The Wild",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900",
    height: "normal"
  },
  {
    id: 8,
    title: "Modern Lines",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900",
    height: "normal"
  }
];

const categories = [
  "All",
  "Nature",
  "Architecture",
  "Portrait",
  "Street",
  "Lifestyle",
  "AI Generated",
  "My Uploads"
];

function App() {
  const [images, setImages] = useState(initialImages);

  const [activeCategory, setActiveCategory] = useState("All");

  const [search, setSearch] = useState("");

  const [favorites, setFavorites] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const [mobileMenu, setMobileMenu] = useState(false);

  // FILTER GALLERY

  const filteredImages = images.filter((image) => {
    const categoryMatch =
      activeCategory === "All" ||
      image.category === activeCategory;

    const searchMatch =
      image.title.toLowerCase().includes(search.toLowerCase()) ||
      image.category.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // FAVORITES

  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  // UPLOAD IMAGES

  const uploadImage = (event) => {
    const files = Array.from(event.target.files || []);

    const newImages = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: Date.now() + Math.random(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        category: "My Uploads",
        image: URL.createObjectURL(file),
        height: "normal"
      }));

    setImages((previous) => [...newImages, ...previous]);

    setActiveCategory("All");

    setSearch("");

    event.target.value = "";
  };

  // AI GENERATED IMAGE CONNECTION

  const handleGeneratedImage = (generatedImage) => {
    setImages((previous) => [
      generatedImage,
      ...previous
    ]);

    setActiveCategory("All");

    setSearch("");
  };

  // DOWNLOAD IMAGE

  const downloadImage = async (image) => {
    try {
      const response = await fetch(image.image);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${image.title}.jpg`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

    } catch {
      window.open(image.image, "_blank");
    }
  };

  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <a href="#home" className="brand">

          <div className="brand-icon">
            <Camera size={21} />
          </div>

          <span>
            web<span className="brand-light">gallery</span>
          </span>

        </a>

        <nav className={mobileMenu ? "nav-links show" : "nav-links"}>

          <a href="#home" onClick={() => setMobileMenu(false)}>
            Home
          </a>

          <a href="#gallery" onClick={() => setMobileMenu(false)}>
            Gallery
          </a>

          <a href="#generator" onClick={() => setMobileMenu(false)}>
            AI Generator
          </a>

          <a href="#studio" onClick={() => setMobileMenu(false)}>
            AI Studio
          </a>

          <a href="#features" onClick={() => setMobileMenu(false)}>
            Features
          </a>

        </nav>

        <div className="nav-actions">

          <button
            className="login-btn"
            onClick={() => alert("Login system will be connected in the authentication phase.")}
          >
            Log in
          </button>

          <button
            className="signup-btn"
            onClick={() => alert("Registration will be connected in the authentication phase.")}
          >
            Get started <ArrowUpRight size={16} />
          </button>

        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

      </header>


      <main>

        {/* HERO SECTION */}

        <section className="hero" id="home">

          <div className="hero-content">

            <div className="eyebrow">
              <Sparkles size={14} />
              YOUR CREATIVE WORLD
            </div>

            <h1>
              Every frame has
              <br />
              <span>a story.</span>
            </h1>

            <p>
              Discover beautiful moments, explore your creativity
              and transform ordinary visuals into extraordinary art.
            </p>

            <div className="hero-buttons">

              <a href="#gallery" className="primary-btn">
                Explore gallery <ArrowUpRight size={18} />
              </a>

              <a href="#generator" className="secondary-btn">
                Create with AI
              </a>

            </div>

            <div className="hero-stats">

              <div>
                <h3>50+</h3>
                <span>Creative filters</span>
              </div>

              <div>
                <h3>50+</h3>
                <span>Video transitions</span>
              </div>

              <div>
                <h3>∞</h3>
                <span>Creative possibilities</span>
              </div>

            </div>

          </div>

          <div className="hero-visual">

            <div className="hero-image-main">

              <img
                src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200"
                alt="Mountain landscape"
              />

            </div>

            <div className="floating-card">

              <div className="floating-icon">
                <Sparkles size={19} />
              </div>

              <div>
                <strong>Made to create</strong>
                <span>Your vision, your style.</span>
              </div>

            </div>

            <div className="hero-image-small">

              <img
                src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500"
                alt="Ocean"
              />

            </div>

          </div>

        </section>


        {/* AI IMAGE GENERATOR */}

        <ImageGenerator
          onImageGenerated={handleGeneratedImage}
        />


        {/* GALLERY SECTION */}

        <section className="gallery-section" id="gallery">

          <div className="section-heading">

            <div>

              <div className="eyebrow">
                THE COLLECTION
              </div>

              <h2>
                Explore the gallery<span>.</span>
              </h2>

              <p>
                A collection of moments worth remembering.
              </p>

            </div>

            <label className="upload-btn">

              <Upload size={17} />

              Upload photos

              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={uploadImage}
              />

            </label>

          </div>


          {/* SEARCH AND FILTER */}

          <div className="gallery-controls">

            <div className="search-box">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search photographs..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

            </div>

            <div className="category-list">

              {categories.map((category) => (

                <button
                  key={category}
                  className={
                    activeCategory === category
                      ? "category-btn active"
                      : "category-btn"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>

              ))}

            </div>

          </div>


          {/* IMAGE GRID */}

          <div className="gallery-grid">

            {filteredImages.map((image) => (

              <div className="gallery-card" key={image.id}>

                <div
                  className={`gallery-image ${image.height}`}
                  onClick={() => setSelectedImage(image)}
                >

                  <img
                    src={image.image}
                    alt={image.title}
                    loading="lazy"
                  />

                  <div className="image-overlay">

                    <button
                      className="favorite-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(image.id);
                      }}
                    >

                      <Heart
                        size={18}
                        fill={
                          favorites.includes(image.id)
                            ? "white"
                            : "none"
                        }
                      />

                    </button>

                    <button className="view-btn">
                      View image <ArrowUpRight size={15} />
                    </button>

                  </div>

                </div>

                <div className="image-details">

                  <div>
                    <h3>{image.title}</h3>
                    <span>{image.category}</span>
                  </div>

                  <button
                    className="download-btn"
                    onClick={() => downloadImage(image)}
                    title="Download image"
                  >
                    <Download size={17} />
                  </button>

                </div>

              </div>

            ))}

          </div>


          {filteredImages.length === 0 && (

            <div className="empty-state">

              <ImageIcon size={35} />

              <h3>No images found</h3>

              <p>Try another search or category.</p>

            </div>

          )}

        </section>


        {/* AI STUDIO */}

        <section className="studio-section" id="studio">

          <div className="studio-content">

            <div className="eyebrow">
              <Sparkles size={14} />
              YOUR CREATIVE STUDIO
            </div>

            <h2>
              Creativity meets
              <br />
              <span>artificial intelligence.</span>
            </h2>

            <p>
              Take your photographs and videos to another level.
              Edit, enhance and create with intelligent creative tools.
            </p>

            <div className="studio-buttons">

              <button
                onClick={() => alert("AI Photo Editor will be added in the next development phase.")}
              >
                Open photo editor <ChevronRight size={17} />
              </button>

              <button
                onClick={() => alert("AI Video Editor will be added in the video development phase.")}
              >
                Open video editor <ChevronRight size={17} />
              </button>

            </div>

          </div>

          <div className="studio-cards">

            <div className="studio-card">

              <div className="studio-card-icon">
                <ImageIcon size={24} />
              </div>

              <h3>AI Photo Editor</h3>

              <p>
                Enhance, retouch and transform your photographs.
              </p>

              <span>PHOTO STUDIO</span>

            </div>

            <div className="studio-card">

              <div className="studio-card-icon">
                <Film size={24} />
              </div>

              <h3>AI Video Editor</h3>

              <p>
                Create cinematic videos with smart transitions.
              </p>

              <span>VIDEO STUDIO</span>

            </div>

          </div>

        </section>


        {/* FEATURES */}

        <section className="features-section" id="features">

          <div className="eyebrow">
            WHY WEB GALLERY
          </div>

          <h2>
            Everything you need to create<span>.</span>
          </h2>

          <div className="features-grid">

            <div className="feature-card">

              <Camera size={25} />

              <h3>Personal gallery</h3>

              <p>
                Keep your favourite photographs in one creative space.
              </p>

            </div>

            <div className="feature-card">

              <Sparkles size={25} />

              <h3>AI powered editing</h3>

              <p>
                Discover smarter ways to enhance your content.
              </p>

            </div>

            <div className="feature-card">

              <SlidersHorizontal size={25} />

              <h3>Premium filters</h3>

              <p>
                Explore different moods and visual aesthetics.
              </p>

            </div>

            <div className="feature-card">

              <Film size={25} />

              <h3>Video transitions</h3>

              <p>
                Make your videos more dynamic and cinematic.
              </p>

            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="footer">

        <a href="#home" className="brand">

          <div className="brand-icon">
            <Camera size={20} />
          </div>

          <span>
            web<span className="brand-light">gallery</span>
          </span>

        </a>

        <p>
          Made for creators. Built for creativity.
        </p>

        <span>
          © 2026 WEB GALLERY. All rights reserved.
        </span>

      </footer>


      {/* IMAGE PREVIEW MODAL */}

      {selectedImage && (

        <div
          className="modal"
          onClick={() => setSelectedImage(null)}
        >

          <button
            className="modal-close"
            onClick={() => setSelectedImage(null)}
          >
            <X size={25} />
          </button>

          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
            />

            <div className="modal-info">

              <div>
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.category}</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => downloadImage(selectedImage)}
              >
                <Download size={17} />
                Download
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
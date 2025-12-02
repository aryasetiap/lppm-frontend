import { useState, useEffect } from "react";
import { FaBuilding, FaUser, FaEye, FaList, FaTrophy, FaStar, FaTrash, FaPlus, FaEdit } from "react-icons/fa";

interface StaffMember {
  nama: string;
  foto: string;
  placeholder: string;
  jabatan: string;
  periode: string;
}

interface Pimpinan {
  ketua?: {
    nama: string;
    foto: string;
    placeholder: string;
    jabatan: string;
    periode: string;
  };
  sekretaris?: {
    nama: string;
    foto: string;
    placeholder: string;
    jabatan: string;
    periode: string;
  };
  staff?: StaffMember[];
}

interface Profil {
  visi: string;
  misi: string[];
  program_unggulan: string[];
  prestasi: string[];
  keunggulan: string[];
}

interface SubBagianItem {
  nama: string;
  singkatan: string;
  kategori: string;
  pimpinan: Pimpinan;
  profile_singkat: string;
  profil: Profil;
  tugas_fungsi: string[];
  struktur_organisasi: {
    gambar_struktur: string;
    gambar_placeholder: string;
  };
}

interface SubBagianData {
  metadata: {
    last_updated: string;
    data_source: string;
    description: string;
  };
  sub_bagian: {
    pui?: Record<string, SubBagianItem>;
    puslit?: Record<string, SubBagianItem>;
    administrasi?: Record<string, SubBagianItem>;
  };
}

interface SubBagianFormProps {
  data: SubBagianData | null;
  onChange: (data: SubBagianData) => void;
}

const SubBagianForm = ({ data, onChange }: SubBagianFormProps) => {
  const [formData, setFormData] = useState<SubBagianData | null>(data);
  const [selectedCategory, setSelectedCategory] = useState<"pui" | "puslit" | "administrasi">("pui");
  const [selectedItemSlug, setSelectedItemSlug] = useState<string | null>(null);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!formData) return <div className="text-blue-100">Memuat data...</div>;

  // Ensure structure exists dengan default values
  const safeData: SubBagianData = {
    metadata: {
      last_updated: formData.metadata?.last_updated || "",
      data_source: formData.metadata?.data_source || "LPPM Unila Database",
      description: formData.metadata?.description || "",
    },
    sub_bagian: {
      pui: formData.sub_bagian?.pui || {},
      puslit: formData.sub_bagian?.puslit || {},
      administrasi: formData.sub_bagian?.administrasi || {},
    },
  };

  const currentCategoryItems = safeData.sub_bagian[selectedCategory] || {};
  const itemSlugs = Object.keys(currentCategoryItems);
  const selectedItemRaw = selectedItemSlug ? currentCategoryItems[selectedItemSlug] : null;

  // Sanitize item to ensure arrays exist
  const selectedItem: SubBagianItem | null = selectedItemRaw ? {
    ...selectedItemRaw,
    profil: {
      ...selectedItemRaw.profil,
      visi: selectedItemRaw.profil?.visi || "",
      misi: selectedItemRaw.profil?.misi || [],
      program_unggulan: selectedItemRaw.profil?.program_unggulan || [],
      prestasi: selectedItemRaw.profil?.prestasi || [],
      keunggulan: selectedItemRaw.profil?.keunggulan || [],
    },
    tugas_fungsi: selectedItemRaw.tugas_fungsi || [],
    pimpinan: {
      ketua: selectedItemRaw.pimpinan?.ketua || {
        nama: "",
        foto: "",
        placeholder: "",
        jabatan: "",
        periode: "",
      },
      sekretaris: selectedItemRaw.pimpinan?.sekretaris,
      staff: selectedItemRaw.pimpinan?.staff || [],
    },
    struktur_organisasi: selectedItemRaw.struktur_organisasi || {
      gambar_struktur: "",
      gambar_placeholder: "",
    }
  } : null;

  const updateMetadata = (field: string, value: string) => {
    const newData = { ...safeData };
    newData.metadata = {
      ...safeData.metadata,
      [field]: value,
    };
    setFormData(newData);
    onChange(newData);
  };

  const updateItem = (slug: string, updates: Partial<SubBagianItem>) => {
    const newData = { ...safeData };
    if (!newData.sub_bagian[selectedCategory]) {
      newData.sub_bagian[selectedCategory] = {};
    }
    newData.sub_bagian[selectedCategory]![slug] = {
      ...newData.sub_bagian[selectedCategory]![slug],
      ...updates,
    };
    setFormData(newData);
    onChange(newData);
  };

  const updateItemField = (path: string[], value: any) => {
    if (!selectedItemSlug) return;
    const newData = { ...safeData };
    const item = { ...newData.sub_bagian[selectedCategory]![selectedItemSlug] };
    let current: any = item;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    updateItem(selectedItemSlug, item);
  };

  const updateArrayItem = (path: string[], index: number, value: any) => {
    if (!selectedItemSlug) return;
    const newData = { ...safeData };
    const item = { ...newData.sub_bagian[selectedCategory]![selectedItemSlug] };

    // Navigate to the array
    let current: any = item;
    // If path includes index (e.g. ["pimpinan", "staff", "0", "nama"])
    // We need to handle this differently or simplify the call signature.
    // Let's assume path points to the array itself for simple arrays (string[]),
    // OR path points to the property inside the array item if we pass index.

    // Actually, let's make a specific handler for staff updates to be safe and clean
    // But to keep it generic:

    // Case 1: Simple array of strings (e.g. misi) -> path=["profil", "misi"], index=0, value="new string"
    // Case 2: Array of objects (e.g. staff) -> path=["pimpinan", "staff", "0", "nama"], index=0 (redundant), value="new name"

    // Let's stick to the existing usage for simple arrays and add a new helper for staff/objects if needed.
    // The existing usage: updateArrayItem(["profil", "misi"], index, e.target.value)

    // For staff, I used: updateArrayItem(["pimpinan", "staff", index.toString(), "nama"], index, e.target.value)
    // This requires logic to handle the path traversal correctly.

    if (path.length > 2 && !isNaN(parseInt(path[path.length - 2]))) {
      // Deep update inside array item
      // path: ["pimpinan", "staff", "0", "nama"]
      let ptr: any = item;
      for (let i = 0; i < path.length - 1; i++) {
        if (!ptr[path[i]]) ptr[path[i]] = {}; // Should not happen for array index but safety
        ptr = ptr[path[i]];
      }
      ptr[path[path.length - 1]] = value;
    } else {
      // Simple array update
      for (const key of path) {
        current = current[key];
      }
      current[index] = value;
    }

    updateItem(selectedItemSlug, item);
  };

  const addArrayItem = (path: string[]) => {
    if (!selectedItemSlug) return;
    const newData = { ...safeData };
    const item = { ...newData.sub_bagian[selectedCategory]![selectedItemSlug] };
    let current: any = item;
    for (const key of path) {
      current = current[key];
    }
    current.push("");
    updateItem(selectedItemSlug, item);
  };

  const removeArrayItem = (path: string[], index: number) => {
    if (!selectedItemSlug) return;
    const newData = { ...safeData };
    const item = { ...newData.sub_bagian[selectedCategory]![selectedItemSlug] };
    let current: any = item;
    for (const key of path) {
      current = current[key];
    }
    current.splice(index, 1);
    updateItem(selectedItemSlug, item);
  };

  const addNewItem = () => {
    const newSlug = `item-baru-${Date.now()}`;
    const newItem: SubBagianItem = {
      nama: "Nama Sub Bagian Baru",
      singkatan: "Singkatan",
      kategori: selectedCategory.toUpperCase(),
      pimpinan: {
        ketua: {
          nama: "",
          foto: "",
          placeholder: "",
          jabatan: "",
          periode: "",
        },
      },
      profile_singkat: "",
      profil: {
        visi: "",
        misi: [],
        program_unggulan: [],
        prestasi: [],
        keunggulan: [],
      },
      tugas_fungsi: [],
      struktur_organisasi: {
        gambar_struktur: "",
        gambar_placeholder: "",
      },
    };
    const newData = { ...safeData };
    if (!newData.sub_bagian[selectedCategory]) {
      newData.sub_bagian[selectedCategory] = {};
    }
    newData.sub_bagian[selectedCategory]![newSlug] = newItem;
    setFormData(newData);
    onChange(newData);
    setSelectedItemSlug(newSlug);
  };

  const deleteItem = (slug: string) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    const newData = { ...safeData };
    delete newData.sub_bagian[selectedCategory]![slug];
    setFormData(newData);
    onChange(newData);
    if (selectedItemSlug === slug) {
      setSelectedItemSlug(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metadata */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaBuilding /> Metadata
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Last Updated
            </label>
            <input
              type="text"
              value={safeData.metadata.last_updated}
              onChange={(e) => updateMetadata("last_updated", e.target.value)}
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Data Source
            </label>
            <input
              type="text"
              value={safeData.metadata.data_source}
              onChange={(e) => updateMetadata("data_source", e.target.value)}
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Description
            </label>
            <input
              type="text"
              value={safeData.metadata.description}
              onChange={(e) => updateMetadata("description", e.target.value)}
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs & Item List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Tabs & Item List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-4">Kategori</h3>
            <div className="flex flex-col gap-2">
              {(["pui", "puslit", "administrasi"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedItemSlug(null);
                  }}
                  className={`text-left px-4 py-3 rounded-xl transition-colors ${selectedCategory === cat
                    ? "bg-blue-500/20 border border-blue-400/40 text-white"
                    : "bg-white/5 border border-white/10 text-blue-100 hover:bg-white/10"
                    }`}
                >
                  <div className="font-semibold">{cat.toUpperCase()}</div>
                  <div className="text-xs text-blue-200">
                    {Object.keys(safeData.sub_bagian[cat] || {}).length} item
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Daftar Item</h3>
              <button
                onClick={addNewItem}
                className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-500/30 text-sm"
              >
                <FaPlus />
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {itemSlugs.length === 0 ? (
                <p className="text-sm text-blue-200 text-center py-4">
                  Belum ada item. Klik + untuk menambah.
                </p>
              ) : (
                itemSlugs.map((slug) => {
                  const item = currentCategoryItems[slug];
                  return (
                    <div
                      key={slug}
                      className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedItemSlug === slug
                        ? "bg-blue-500/20 border border-blue-400/40"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      onClick={() => {
                        setSelectedItemSlug(slug);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm truncate">
                            {item.singkatan || item.nama}
                          </div>
                          <div className="text-xs text-blue-200 truncate">
                            {item.nama}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(slug);
                          }}
                          className="px-2 py-1 bg-red-500/20 border border-red-400/40 rounded text-red-200 hover:bg-red-500/30 text-xs"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Item Editor */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <FaEdit /> Edit Item
                </h3>
                <div className="text-sm text-blue-200">
                  Slug: <code className="bg-black/20 px-2 py-1 rounded">{selectedItemSlug}</code>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={selectedItem.nama}
                    onChange={(e) => updateItemField(["nama"], e.target.value)}
                    className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Singkatan
                  </label>
                  <input
                    type="text"
                    value={selectedItem.singkatan}
                    onChange={(e) => updateItemField(["singkatan"], e.target.value)}
                    className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Profile Singkat
                  </label>
                  <textarea
                    value={selectedItem.profile_singkat}
                    onChange={(e) => updateItemField(["profile_singkat"], e.target.value)}
                    className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                    rows={3}
                  />
                </div>
              </div>

              {/* Pimpinan */}
              <section className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FaUser /> Pimpinan
                </h4>
                <div className="space-y-4">
                  {selectedItem.pimpinan.ketua && (
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-2">
                        Ketua - Nama
                      </label>
                      <input
                        type="text"
                        value={selectedItem.pimpinan.ketua.nama}
                        onChange={(e) =>
                          updateItemField(["pimpinan", "ketua", "nama"], e.target.value)
                        }
                        className="w-full bg-[#0b1f3d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-blue-100 mb-1">
                          Foto URL
                        </label>
                        <input
                          type="text"
                          value={selectedItem.pimpinan.ketua.foto}
                          onChange={(e) =>
                            updateItemField(["pimpinan", "ketua", "foto"], e.target.value)
                          }
                          className="w-full bg-[#0b1f3d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Jabatan"
                          value={selectedItem.pimpinan.ketua.jabatan}
                          onChange={(e) =>
                            updateItemField(["pimpinan", "ketua", "jabatan"], e.target.value)
                          }
                          className="bg-[#0b1f3d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                        />
                        <input
                          type="text"
                          placeholder="Periode"
                          value={selectedItem.pimpinan.ketua.periode}
                          onChange={(e) =>
                            updateItemField(["pimpinan", "ketua", "periode"], e.target.value)
                          }
                          className="bg-[#0b1f3d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                        />
                      </div>
                    </div>
                  )}

                  {/* Staff Section */}
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <h5 className="font-semibold mb-3 text-sm text-blue-100">Staff / Anggota</h5>
                    <div className="space-y-4">
                      {selectedItem.pimpinan.staff?.map((staff, index) => (
                        <div key={index} className="bg-black/20 rounded-lg p-3 border border-white/5">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-blue-200">Staff #{index + 1}</span>
                            <button
                              onClick={() => removeArrayItem(["pimpinan", "staff"], index)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-blue-300 mb-1">Nama</label>
                              <input
                                type="text"
                                value={staff.nama}
                                onChange={(e) =>
                                  updateArrayItem(["pimpinan", "staff", index.toString(), "nama"], index, e.target.value)
                                }
                                className="w-full bg-[#0b1f3d] border border-white/10 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-blue-300 mb-1">Jabatan</label>
                              <input
                                type="text"
                                value={staff.jabatan}
                                onChange={(e) =>
                                  updateArrayItem(["pimpinan", "staff", index.toString(), "jabatan"], index, e.target.value)
                                }
                                className="w-full bg-[#0b1f3d] border border-white/10 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-blue-300 mb-1">Foto URL</label>
                              <input
                                type="text"
                                value={staff.foto}
                                onChange={(e) =>
                                  updateArrayItem(["pimpinan", "staff", index.toString(), "foto"], index, e.target.value)
                                }
                                className="w-full bg-[#0b1f3d] border border-white/10 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-blue-300 mb-1">Periode</label>
                              <input
                                type="text"
                                value={staff.periode}
                                onChange={(e) =>
                                  updateArrayItem(["pimpinan", "staff", index.toString(), "periode"], index, e.target.value)
                                }
                                className="w-full bg-[#0b1f3d] border border-white/10 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newStaff: StaffMember = {
                            nama: "",
                            foto: "",
                            placeholder: "https://via.placeholder.com/400x400",
                            jabatan: "Staff",
                            periode: "",
                          };
                          if (!selectedItemSlug) return;
                          const newData = { ...safeData };
                          const item = { ...newData.sub_bagian[selectedCategory]![selectedItemSlug] };
                          if (!item.pimpinan.staff) item.pimpinan.staff = [];
                          item.pimpinan.staff.push(newStaff);
                          updateItem(selectedItemSlug, item);
                        }}
                        className="w-full py-2 bg-blue-500/20 border border-blue-400/40 rounded-lg text-blue-200 hover:bg-blue-500/30 text-sm flex items-center justify-center gap-2"
                      >
                        <FaPlus /> Tambah Staff
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Visi Misi */}
              <section className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FaEye /> Visi & Misi
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-100 mb-2">
                      Visi
                    </label>
                    <textarea
                      value={selectedItem.profil.visi}
                      onChange={(e) => updateItemField(["profil", "visi"], e.target.value)}
                      className="w-full bg-[#0b1f3d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-100 mb-2">
                      Misi
                    </label>
                    {selectedItem.profil.misi.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayItem(["profil", "misi"], index, e.target.value)}
                          className="flex-1 bg-[#0b1f3d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                        />
                        <button
                          onClick={() => removeArrayItem(["profil", "misi"], index)}
                          className="px-3 py-2 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 hover:bg-red-500/30 text-sm"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem(["profil", "misi"])}
                      className="mt-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-500/30 text-sm"
                    >
                      <FaPlus className="inline mr-2" /> Tambah Misi
                    </button>
                  </div>
                </div>
              </section>

              {/* Program, Prestasi, Keunggulan */}
              {(["program_unggulan", "prestasi", "keunggulan"] as const).map((field) => (
                <section key={field} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    {field === "program_unggulan" && <FaStar />}
                    {field === "prestasi" && <FaTrophy />}
                    {field === "keunggulan" && <FaStar />}
                    {field === "program_unggulan" && "Program Unggulan"}
                    {field === "prestasi" && "Prestasi"}
                    {field === "keunggulan" && "Keunggulan"}
                  </h4>
                  <div className="space-y-2">
                    {selectedItem.profil[field].map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayItem(["profil", field], index, e.target.value)}
                          className="flex-1 bg-[#0b1f3d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                        />
                        <button
                          onClick={() => removeArrayItem(["profil", field], index)}
                          className="px-3 py-2 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 hover:bg-red-500/30 text-sm"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem(["profil", field])}
                      className="mt-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-500/30 text-sm"
                    >
                      <FaPlus className="inline mr-2" /> Tambah
                    </button>
                  </div>
                </section>
              ))}

              {/* Tugas Fungsi */}
              <section className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FaList /> Tugas & Fungsi
                </h4>
                <div className="space-y-2">
                  {selectedItem.tugas_fungsi.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem(["tugas_fungsi"], index, e.target.value)}
                        className="flex-1 bg-[#0b1f3d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                      <button
                        onClick={() => removeArrayItem(["tugas_fungsi"], index)}
                        className="px-3 py-2 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 hover:bg-red-500/30 text-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem(["tugas_fungsi"])}
                    className="mt-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-500/30 text-sm"
                  >
                    <FaPlus className="inline mr-2" /> Tambah Tugas/Fungsi
                  </button>
                </div>
              </section>

              {/* Struktur Organisasi */}
              <section className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FaBuilding /> Struktur Organisasi
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-100 mb-2">
                      Gambar Struktur
                    </label>
                    <input
                      type="text"
                      value={selectedItem.struktur_organisasi.gambar_struktur}
                      onChange={(e) =>
                        updateItemField(["struktur_organisasi", "gambar_struktur"], e.target.value)
                      }
                      className="w-full bg-[#0b1f3d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                    />
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <FaEdit className="w-16 h-16 text-blue-200 mx-auto mb-4 opacity-50" />
              <p className="text-blue-100">
                Pilih item dari daftar di sebelah kiri untuk mulai mengedit
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubBagianForm;


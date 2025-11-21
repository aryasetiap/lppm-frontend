import { useState, useEffect } from "react";
import { FaUser, FaEye, FaList, FaBuilding, FaFileCode } from "react-icons/fa";

interface ProfileData {
  metadata: {
    last_updated: string;
    data_source: string;
    description: string;
  };
  pimpinan: {
    kepala_lppm: {
      nama: string;
      foto: string;
      placeholder: string;
      jabatan: string;
      periode: string;
    };
    sekretaris_lppm: {
      nama: string;
      foto: string;
      placeholder: string;
      jabatan: string;
      periode: string;
    };
  };
  visi_misi: {
    visi: string;
    misi: Array<{ id: number; item: string }>;
  };
  tugas_fungsi: {
    tugas: Array<{ id: number; item: string }>;
    fungsi: Array<{ id: number; item: string }>;
  };
  struktur_organisasi: {
    gambar_struktur: string;
    gambar_placeholder: string;
    deskripsi: string;
  };
}

interface ProfileFormProps {
  data: ProfileData | null;
  onChange: (data: ProfileData) => void;
}

const ProfileForm = ({ data, onChange }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileData | null>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!formData) return <div className="text-blue-100">Memuat data...</div>;

  const updateField = (path: string[], value: any) => {
    const newData = { ...formData };
    let current: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setFormData(newData);
    onChange(newData);
  };

  const updateArrayItem = (path: string[], index: number, value: any) => {
    const newData = { ...formData };
    let current: any = newData;
    for (const key of path) {
      current = current[key];
    }
    current[index] = { ...current[index], ...value };
    setFormData(newData);
    onChange(newData);
  };

  const addArrayItem = (path: string[], newItem: any) => {
    const newData = { ...formData };
    let current: any = newData;
    for (const key of path) {
      current = current[key];
    }
    current.push(newItem);
    setFormData(newData);
    onChange(newData);
  };

  const removeArrayItem = (path: string[], index: number) => {
    const newData = { ...formData };
    let current: any = newData;
    for (const key of path) {
      current = current[key];
    }
    current.splice(index, 1);
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-8">
      {/* Metadata */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaFileCode /> Metadata
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Last Updated
            </label>
            <input
              type="text"
              value={formData.metadata.last_updated}
              onChange={(e) => updateField(["metadata", "last_updated"], e.target.value)}
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Data Source
            </label>
            <input
              type="text"
              value={formData.metadata.data_source}
              onChange={(e) => updateField(["metadata", "data_source"], e.target.value)}
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Description
            </label>
            <textarea
              value={formData.metadata.description}
              onChange={(e) => updateField(["metadata", "description"], e.target.value)}
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              rows={2}
            />
          </div>
        </div>
      </section>

      {/* Pimpinan */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaUser /> Pimpinan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kepala LPPM */}
          <div className="space-y-4">
            <h4 className="font-medium text-blue-200">Kepala LPPM</h4>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Nama
              </label>
              <input
                type="text"
                value={formData.pimpinan.kepala_lppm.nama}
                onChange={(e) =>
                  updateField(["pimpinan", "kepala_lppm", "nama"], e.target.value)
                }
                className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Foto
              </label>
              <input
                type="text"
                value={formData.pimpinan.kepala_lppm.foto}
                onChange={(e) =>
                  updateField(["pimpinan", "kepala_lppm", "foto"], e.target.value)
                }
                className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Jabatan
              </label>
              <input
                type="text"
                value={formData.pimpinan.kepala_lppm.jabatan}
                onChange={(e) =>
                  updateField(["pimpinan", "kepala_lppm", "jabatan"], e.target.value)
                }
                className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Periode
              </label>
              <input
                type="text"
                value={formData.pimpinan.kepala_lppm.periode}
                onChange={(e) =>
                  updateField(["pimpinan", "kepala_lppm", "periode"], e.target.value)
                }
                className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
          </div>

          {/* Sekretaris LPPM */}
          <div className="space-y-4">
            <h4 className="font-medium text-blue-200">Sekretaris LPPM</h4>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Nama
              </label>
              <input
                type="text"
                value={formData.pimpinan.sekretaris_lppm.nama}
                onChange={(e) =>
                  updateField(["pimpinan", "sekretaris_lppm", "nama"], e.target.value)
                }
                className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Foto
              </label>
              <input
                type="text"
                value={formData.pimpinan.sekretaris_lppm.foto}
                onChange={(e) =>
                  updateField(["pimpinan", "sekretaris_lppm", "foto"], e.target.value)
                }
                className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Jabatan
              </label>
              <input
                type="text"
                value={formData.pimpinan.sekretaris_lppm.jabatan}
                onChange={(e) =>
                  updateField(["pimpinan", "sekretaris_lppm", "jabatan"], e.target.value)
                }
                className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Periode
              </label>
              <input
                type="text"
                value={formData.pimpinan.sekretaris_lppm.periode}
                onChange={(e) =>
                  updateField(["pimpinan", "sekretaris_lppm", "periode"], e.target.value)
                }
                className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaEye /> Visi & Misi
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Visi
            </label>
            <textarea
              value={formData.visi_misi.visi}
              onChange={(e) => updateField(["visi_misi", "visi"], e.target.value)}
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Misi
            </label>
            {formData.visi_misi.misi.map((item, index) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) =>
                    updateArrayItem(["visi_misi", "misi"], index, {
                      id: item.id,
                      item: e.target.value,
                    })
                  }
                  className="flex-1 bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
                <button
                  onClick={() => removeArrayItem(["visi_misi", "misi"], index)}
                  className="px-3 py-2 bg-red-500/20 border border-red-400/40 rounded-xl text-red-200 hover:bg-red-500/30"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                addArrayItem(["visi_misi", "misi"], {
                  id: formData.visi_misi.misi.length + 1,
                  item: "",
                })
              }
              className="mt-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 hover:bg-emerald-500/30"
            >
              + Tambah Misi
            </button>
          </div>
        </div>
      </section>

      {/* Tugas & Fungsi */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaList /> Tugas & Fungsi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tugas */}
          <div>
            <h4 className="font-medium text-blue-200 mb-3">Tugas</h4>
            {formData.tugas_fungsi.tugas.map((item, index) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) =>
                    updateArrayItem(["tugas_fungsi", "tugas"], index, {
                      id: item.id,
                      item: e.target.value,
                    })
                  }
                  className="flex-1 bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
                <button
                  onClick={() => removeArrayItem(["tugas_fungsi", "tugas"], index)}
                  className="px-3 py-2 bg-red-500/20 border border-red-400/40 rounded-xl text-red-200 hover:bg-red-500/30"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                addArrayItem(["tugas_fungsi", "tugas"], {
                  id: formData.tugas_fungsi.tugas.length + 1,
                  item: "",
                })
              }
              className="mt-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 hover:bg-emerald-500/30"
            >
              + Tambah Tugas
            </button>
          </div>

          {/* Fungsi */}
          <div>
            <h4 className="font-medium text-blue-200 mb-3">Fungsi</h4>
            {formData.tugas_fungsi.fungsi.map((item, index) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) =>
                    updateArrayItem(["tugas_fungsi", "fungsi"], index, {
                      id: item.id,
                      item: e.target.value,
                    })
                  }
                  className="flex-1 bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
                <button
                  onClick={() => removeArrayItem(["tugas_fungsi", "fungsi"], index)}
                  className="px-3 py-2 bg-red-500/20 border border-red-400/40 rounded-xl text-red-200 hover:bg-red-500/30"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                addArrayItem(["tugas_fungsi", "fungsi"], {
                  id: formData.tugas_fungsi.fungsi.length + 1,
                  item: "",
                })
              }
              className="mt-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 hover:bg-emerald-500/30"
            >
              + Tambah Fungsi
            </button>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaBuilding /> Struktur Organisasi
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Gambar Struktur
            </label>
            <input
              type="text"
              value={formData.struktur_organisasi.gambar_struktur}
              onChange={(e) =>
                updateField(["struktur_organisasi", "gambar_struktur"], e.target.value)
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.struktur_organisasi.deskripsi}
              onChange={(e) =>
                updateField(["struktur_organisasi", "deskripsi"], e.target.value)
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              rows={3}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileForm;


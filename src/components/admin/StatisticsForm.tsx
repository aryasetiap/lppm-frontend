import { useState, useEffect } from "react";
import { FaChartBar, FaPlus, FaTrash } from "react-icons/fa";

interface YearlyData {
  year: number;
  penelitian_blu: number;
  pengabdian_blu: number;
  paten: number;
  haki: number;
  pengabdian_breakdown?: {
    diseminasi_hasil_riset: number;
    desa_binaan: number;
    unggulan: number;
  };
}

interface QuarterlyData {
  quarter: string;
  penelitian_blu: number;
  pengabdian_blu: number;
}

interface StatisticsData {
  metadata: {
    last_updated: string;
    data_source: string;
    description: string;
  };
  yearly_data: YearlyData[];
  total_summary: {
    total_penelitian_blu: number;
    total_pengabdian_blu: number;
    total_paten: number;
    total_haki: number;
    growth_penelitian: number;
    growth_pengabdian: number;
    growth_paten: number;
    growth_haki: number;
  };
  quarterly_data: QuarterlyData[];
}

interface StatisticsFormProps {
  data: StatisticsData | null;
  onChange: (data: StatisticsData) => void;
}

const StatisticsForm = ({ data, onChange }: StatisticsFormProps) => {
  const [formData, setFormData] = useState<StatisticsData | null>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!formData) return <div className="text-blue-100">Memuat data...</div>;

  // Ensure arrays and objects exist with default values
  const safeData: StatisticsData = {
    ...formData,
    yearly_data: formData.yearly_data || [],
    quarterly_data: formData.quarterly_data || [],
    total_summary: formData.total_summary || {
      total_penelitian_blu: 0,
      total_pengabdian_blu: 0,
      total_paten: 0,
      total_haki: 0,
      growth_penelitian: 0,
      growth_pengabdian: 0,
      growth_paten: 0,
      growth_haki: 0,
    },
    metadata: formData.metadata || {
      last_updated: new Date().toISOString().split('T')[0],
      data_source: "LPPM Unila Database",
      description: "",
    },
  };

  const updateField = (path: string[], value: any) => {
    const newData = { ...safeData };
    let current: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setFormData(newData);
    onChange(newData);
  };

  const updateYearlyData = (index: number, field: string, value: any) => {
    const newData = { ...safeData };
    newData.yearly_data[index] = { ...newData.yearly_data[index], [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const addYearlyData = () => {
    const newData = { ...safeData };
    const lastYear = newData.yearly_data[newData.yearly_data.length - 1]?.year || 2024;
    newData.yearly_data.push({
      year: lastYear + 1,
      penelitian_blu: 0,
      pengabdian_blu: 0,
      paten: 0,
      haki: 0,
    });
    setFormData(newData);
    onChange(newData);
  };

  const removeYearlyData = (index: number) => {
    const newData = { ...safeData };
    newData.yearly_data.splice(index, 1);
    setFormData(newData);
    onChange(newData);
  };

  const updateQuarterlyData = (index: number, field: string, value: any) => {
    const newData = { ...safeData };
    newData.quarterly_data[index] = { ...newData.quarterly_data[index], [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const addQuarterlyData = () => {
    const newData = { ...safeData };
    newData.quarterly_data.push({
      quarter: "Q1 2025",
      penelitian_blu: 0,
      pengabdian_blu: 0,
    });
    setFormData(newData);
    onChange(newData);
  };

  const removeQuarterlyData = (index: number) => {
    const newData = { ...safeData };
    newData.quarterly_data.splice(index, 1);
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-8">
      {/* Metadata */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartBar /> Metadata
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Last Updated
            </label>
            <input
              type="text"
              value={safeData.metadata.last_updated}
              onChange={(e) => updateField(["metadata", "last_updated"], e.target.value)}
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Description
            </label>
            <textarea
              value={safeData.metadata.description}
              onChange={(e) => updateField(["metadata", "description"], e.target.value)}
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              rows={2}
            />
          </div>
        </div>
      </section>

      {/* Yearly Data */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaChartBar /> Data Tahunan
          </h3>
          <button
            onClick={addYearlyData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 hover:bg-emerald-500/30"
          >
            <FaPlus /> Tambah Tahun
          </button>
        </div>
        <div className="space-y-4 overflow-x-auto">
          {safeData.yearly_data.map((year, index) => (
            <div
              key={index}
              className="bg-[#0b1f3d] border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-blue-200">Tahun {year.year}</h4>
                <button
                  onClick={() => removeYearlyData(index)}
                  className="px-3 py-1 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 hover:bg-red-500/30 text-sm"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-blue-100 mb-1">
                    Tahun
                  </label>
                  <input
                    type="number"
                    value={year.year}
                    onChange={(e) =>
                      updateYearlyData(index, "year", parseInt(e.target.value))
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-100 mb-1">
                    Penelitian BLU
                  </label>
                  <input
                    type="number"
                    value={year.penelitian_blu}
                    onChange={(e) =>
                      updateYearlyData(
                        index,
                        "penelitian_blu",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-100 mb-1">
                    Pengabdian BLU
                  </label>
                  <input
                    type="number"
                    value={year.pengabdian_blu}
                    onChange={(e) =>
                      updateYearlyData(
                        index,
                        "pengabdian_blu",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-100 mb-1">
                    Paten
                  </label>
                  <input
                    type="number"
                    value={year.paten}
                    onChange={(e) =>
                      updateYearlyData(index, "paten", parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-100 mb-1">
                    HKI
                  </label>
                  <input
                    type="number"
                    value={year.haki}
                    onChange={(e) =>
                      updateYearlyData(index, "haki", parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
                {year.pengabdian_breakdown && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-1">
                        Diseminasi
                      </label>
                      <input
                        type="number"
                        value={year.pengabdian_breakdown.diseminasi_hasil_riset}
                        onChange={(e) =>
                          updateYearlyData(index, "pengabdian_breakdown", {
                            ...year.pengabdian_breakdown,
                            diseminasi_hasil_riset: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-1">
                        Desa Binaan
                      </label>
                      <input
                        type="number"
                        value={year.pengabdian_breakdown.desa_binaan}
                        onChange={(e) =>
                          updateYearlyData(index, "pengabdian_breakdown", {
                            ...year.pengabdian_breakdown,
                            desa_binaan: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-1">
                        Unggulan
                      </label>
                      <input
                        type="number"
                        value={year.pengabdian_breakdown.unggulan}
                        onChange={(e) =>
                          updateYearlyData(index, "pengabdian_breakdown", {
                            ...year.pengabdian_breakdown,
                            unggulan: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Total Summary */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Total Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
              Total Penelitian
            </label>
            <input
              type="number"
              value={safeData.total_summary.total_penelitian_blu}
              onChange={(e) =>
                updateField(
                  ["total_summary", "total_penelitian_blu"],
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
              Total Pengabdian
            </label>
            <input
              type="number"
              value={safeData.total_summary.total_pengabdian_blu}
              onChange={(e) =>
                updateField(
                  ["total_summary", "total_pengabdian_blu"],
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
              Total Paten
            </label>
            <input
              type="number"
              value={safeData.total_summary.total_paten}
              onChange={(e) =>
                updateField(
                  ["total_summary", "total_paten"],
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
              Total HKI
            </label>
            <input
              type="number"
              value={safeData.total_summary.total_haki}
              onChange={(e) =>
                updateField(
                  ["total_summary", "total_haki"],
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
              Growth Penelitian (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={safeData.total_summary.growth_penelitian}
              onChange={(e) =>
                updateField(
                  ["total_summary", "growth_penelitian"],
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
              Growth Pengabdian (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={safeData.total_summary.growth_pengabdian}
              onChange={(e) =>
                updateField(
                  ["total_summary", "growth_pengabdian"],
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
              Growth Paten (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={safeData.total_summary.growth_paten}
              onChange={(e) =>
                updateField(
                  ["total_summary", "growth_paten"],
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
              Growth HKI (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={safeData.total_summary.growth_haki}
              onChange={(e) =>
                updateField(
                  ["total_summary", "growth_haki"],
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full bg-[#0b1f3d] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
        </div>
      </section>

      {/* Quarterly Data */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Data Kuartalan</h3>
          <button
            onClick={addQuarterlyData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 hover:bg-emerald-500/30"
          >
            <FaPlus /> Tambah Kuartal
          </button>
        </div>
        <div className="space-y-4">
          {safeData.quarterly_data.map((quarter, index) => (
            <div
              key={index}
              className="bg-[#0b1f3d] border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-blue-200">{quarter.quarter}</h4>
                <button
                  onClick={() => removeQuarterlyData(index)}
                  className="px-3 py-1 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 hover:bg-red-500/30 text-sm"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-blue-100 mb-1">
                    Kuartal
                  </label>
                  <input
                    type="text"
                    value={quarter.quarter}
                    onChange={(e) =>
                      updateQuarterlyData(index, "quarter", e.target.value)
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-100 mb-1">
                    Penelitian BLU
                  </label>
                  <input
                    type="number"
                    value={quarter.penelitian_blu}
                    onChange={(e) =>
                      updateQuarterlyData(
                        index,
                        "penelitian_blu",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-100 mb-1">
                    Pengabdian BLU
                  </label>
                  <input
                    type="number"
                    value={quarter.pengabdian_blu}
                    onChange={(e) =>
                      updateQuarterlyData(
                        index,
                        "pengabdian_blu",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StatisticsForm;


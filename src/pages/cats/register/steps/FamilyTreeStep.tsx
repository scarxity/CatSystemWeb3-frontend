"use client";

import { useRegisterCat } from "../context/RegisterCatContext";
import StepHeader from "../components/StepHeader";
import StepNavButtons from "../components/StepNavButtons";
import StepProgressBar from "../components/StepProgressBar";
import { useRouter } from "next/navigation";
import { useSubmitCat } from "@/hooks/useSubmitCat";

import { useState, useRef } from "react";
import {
	Plus,
	Trash2,
	ChevronDown,
	ChevronUp,
	Search,
	User,
	Hash,
	Calendar,
	Palette,
	CloudUpload,
	Info,
	ChevronRight
} from "lucide-react";
import type { CatGender } from "@/types/cat";
import type { Sibling, Offspring, ParentInfo } from "@/types/registerCat";

/* ================================================================
   FIELDS ONLY — used by the desktop layout panel & mobile view
   ================================================================ */
export function FamilyTreeFields() {
	const { formData, updateFamilyTree } = useRegisterCat();
	const family = formData.familyTree;

	const [motherOpen, setMotherOpen] = useState(true);
	const [motherManual, setMotherManual] = useState(true); // Default manual to show fields

	const [fatherOpen, setFatherOpen] = useState(false);
	const [fatherManual, setFatherManual] = useState(true);

	const [siblingsOpen, setSiblingsOpen] = useState(false);
	const [grandparentsOpen, setGrandparentsOpen] = useState(false);
	const [offspringOpen, setOffspringOpen] = useState(false);
	const [pedigreeOpen, setPedigreeOpen] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	// Modal States for Siblings & Offspring
	const [activeModal, setActiveModal] = useState<"sibling" | "offspring" | null>(null);
	const [tempCat, setTempCat] = useState<Sibling | Offspring>({ id: "", name: "", gender: "Male", dateOfBirth: "" });

	// --- Parent Helpers ---
	const updateMother = (field: keyof ParentInfo, value: string) => {
		const current = family.mother || { name: "", id: "", breed: "", dateOfBirth: "", color: "" };
		updateFamilyTree({ mother: { ...current, [field]: value } });
	};
	const deleteMother = () => updateFamilyTree({ mother: null });

	const updateFather = (field: keyof ParentInfo, value: string) => {
		const current = family.father || { name: "", id: "", breed: "", dateOfBirth: "", color: "" };
		updateFamilyTree({ father: { ...current, [field]: value } });
	};
	const deleteFather = () => updateFamilyTree({ father: null });

	// --- Sibling/Offspring Helpers ---
	const handleSaveModal = () => {
		if (activeModal === "sibling") {
			const isExisting = family.siblings.some(s => s.id === tempCat.id);
			if (isExisting) {
				updateFamilyTree({ siblings: family.siblings.map(s => s.id === tempCat.id ? tempCat : s) });
			} else {
				updateFamilyTree({ siblings: [...family.siblings, { ...tempCat, id: crypto.randomUUID() }] });
			}
		} else if (activeModal === "offspring") {
			const isExisting = family.offspring.some(o => o.id === tempCat.id);
			if (isExisting) {
				updateFamilyTree({ offspring: family.offspring.map(o => o.id === tempCat.id ? tempCat : o) });
			} else {
				updateFamilyTree({ offspring: [...family.offspring, { ...tempCat, id: crypto.randomUUID() }] });
			}
		}
		setActiveModal(null);
	};

	const removeSibling = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		updateFamilyTree({ siblings: family.siblings.filter((s) => s.id !== id) });
	};

	const removeOffspring = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		updateFamilyTree({ offspring: family.offspring.filter((o) => o.id !== id) });
	};

	// --- File Upload ---
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		updateFamilyTree({ pedigreeDocument: { ...family.pedigreeDocument, file } });
	};

	return (
		<div className="space-y-4 relative">
			{/* Banner */}
			<div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 mb-2">
				<Info size={18} className="text-orange-500 shrink-0 mt-0.5" />
				<p className="text-sm text-orange-800 font-medium">
					This section is <strong>optional</strong> and can be skipped or partially filled.
				</p>
			</div>

			{/* Mother Info */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<button type="button" onClick={() => setMotherOpen(!motherOpen)} className="flex items-center gap-3 w-full text-left">
					<span className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
						<span className="text-pink-500 font-extrabold text-lg">♀</span>
					</span>
					<div className="flex-1 flex flex-col items-start gap-0.5">
						<h3 className="text-sm font-bold text-gray-900">Mother Information</h3>
						{!motherOpen && family.mother?.name && (
							<span className="text-xs text-gray-500 font-medium">Saved: {family.mother.name}</span>
						)}
					</div>
					<div className="ml-2">
						{motherOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
					</div>
				</button>
				
				{motherOpen && (
					<div className="mt-5 border-t border-gray-50 pt-5 space-y-5">
						<div className={`flex items-center justify-between p-1.5 rounded-xl border-2 transition-all ${motherManual ? "border-pink-300" : "border-gray-200"}`}>
							<button type="button" onClick={() => setMotherManual(false)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!motherManual ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
								Search Data
							</button>
							<button type="button" onClick={() => setMotherManual(true)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${motherManual ? "bg-white shadow-sm text-gray-900 border border-gray-100" : "text-gray-500 hover:text-gray-700"}`}>
								Manual Entry
							</button>
						</div>

						{!motherManual ? (
							<div className="flex items-center gap-2 border-b border-gray-200 py-3 focus-within:border-[#4359ea] transition-all">
								<input type="text" placeholder="Search mother by name or ID..." className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
								<Search size={18} className="text-gray-400 shrink-0" />
							</div>
						) : (
							<div className="space-y-4">
								<div className="flex flex-col sm:flex-row gap-4">
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 transition-all focus-within:border-[#4359ea]">
										<input type="text" value={family.mother?.name || ""} onChange={(e) => updateMother("name", e.target.value)} placeholder="Name" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
										<User size={16} className="text-gray-400 shrink-0" />
									</div>
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 transition-all focus-within:border-[#4359ea]">
										<input type="text" value={family.mother?.id || ""} onChange={(e) => updateMother("id", e.target.value)} placeholder="ID" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
										<Hash size={16} className="text-gray-400 shrink-0" />
									</div>
								</div>
								<div className="flex flex-col sm:flex-row gap-4">
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 transition-all focus-within:border-[#4359ea]">
										<input type="text" value={family.mother?.breed || ""} onChange={(e) => updateMother("breed", e.target.value)} placeholder="Breed" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
										<ChevronRight size={16} className="text-gray-400 shrink-0" />
									</div>
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 focus-within:border-[#4359ea] transition-all">
										<input type="date" value={family.mother?.dateOfBirth || ""} onChange={(e) => updateMother("dateOfBirth", e.target.value)} className="flex-1 text-sm font-semibold text-gray-900 outline-none bg-transparent" />
										<Calendar size={16} className="text-gray-400 shrink-0" />
									</div>
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 transition-all focus-within:border-[#4359ea]">
										<input type="text" value={family.mother?.color || ""} onChange={(e) => updateMother("color", e.target.value)} placeholder="Color" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
										<Palette size={16} className="text-gray-400 shrink-0" />
									</div>
								</div>

								<div className="flex flex-col sm:flex-row gap-3 mt-4">
									<button type="button" onClick={deleteMother} className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-100 bg-red-50 text-red-500 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors">
										<Trash2 size={16} /> Delete Mother
									</button>
									<button type="button" onClick={() => setMotherOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#4359ea] text-white font-bold rounded-xl text-sm hover:bg-[#3348d4] shadow-md shadow-[#4359ea]/20 transition-all">
										Save Data
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Father Info */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<button type="button" onClick={() => setFatherOpen(!fatherOpen)} className="flex items-center gap-3 w-full text-left">
					<span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
						<span className="text-blue-500 font-extrabold text-lg">♂</span>
					</span>
					<div className="flex-1 flex flex-col items-start gap-0.5">
						<h3 className="text-sm font-bold text-gray-900">Father Information</h3>
						{!fatherOpen && family.father?.name && (
							<span className="text-xs text-gray-500 font-medium">Saved: {family.father.name}</span>
						)}
					</div>
					<div className="ml-2">
						{fatherOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
					</div>
				</button>

				{fatherOpen && (
					<div className="mt-5 border-t border-gray-50 pt-5 space-y-5">
						<div className={`flex items-center justify-between p-1.5 rounded-xl border-2 transition-all ${fatherManual ? "border-blue-300" : "border-gray-200"}`}>
							<button type="button" onClick={() => setFatherManual(false)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!fatherManual ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
								Search Data
							</button>
							<button type="button" onClick={() => setFatherManual(true)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${fatherManual ? "bg-white shadow-sm text-gray-900 border border-gray-100" : "text-gray-500 hover:text-gray-700"}`}>
								Manual Entry
							</button>
						</div>

						{!fatherManual ? (
							<div className="flex items-center gap-2 border-b border-gray-200 py-3 focus-within:border-[#4359ea] transition-all">
								<input type="text" placeholder="Search father by name or ID..." className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
								<Search size={18} className="text-gray-400 shrink-0" />
							</div>
						) : (
							<div className="space-y-4">
								<div className="flex flex-col sm:flex-row gap-4">
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 transition-all focus-within:border-[#4359ea]">
										<input type="text" value={family.father?.name || ""} onChange={(e) => updateFather("name", e.target.value)} placeholder="Name" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
										<User size={16} className="text-gray-400 shrink-0" />
									</div>
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 transition-all focus-within:border-[#4359ea]">
										<input type="text" value={family.father?.id || ""} onChange={(e) => updateFather("id", e.target.value)} placeholder="ID" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
										<Hash size={16} className="text-gray-400 shrink-0" />
									</div>
								</div>
								<div className="flex flex-col sm:flex-row gap-4">
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 transition-all focus-within:border-[#4359ea]">
										<input type="text" value={family.father?.breed || ""} onChange={(e) => updateFather("breed", e.target.value)} placeholder="Breed" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
										<ChevronRight size={16} className="text-gray-400 shrink-0" />
									</div>
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 focus-within:border-[#4359ea] transition-all">
										<input type="date" value={family.father?.dateOfBirth || ""} onChange={(e) => updateFather("dateOfBirth", e.target.value)} className="flex-1 text-sm font-semibold text-gray-900 outline-none bg-transparent" />
										<Calendar size={16} className="text-gray-400 shrink-0" />
									</div>
									<div className="flex-1 min-w-[140px] flex items-center gap-2 border-b border-gray-200 py-3 transition-all focus-within:border-[#4359ea]">
										<input type="text" value={family.father?.color || ""} onChange={(e) => updateFather("color", e.target.value)} placeholder="Color" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
										<Palette size={16} className="text-gray-400 shrink-0" />
									</div>
								</div>

								<div className="flex flex-col sm:flex-row gap-3 mt-4">
									<button type="button" onClick={deleteFather} className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-100 bg-red-50 text-red-500 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors">
										<Trash2 size={16} /> Delete Father
									</button>
									<button type="button" onClick={() => setFatherOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#4359ea] text-white font-bold rounded-xl text-sm hover:bg-[#3348d4] shadow-md shadow-[#4359ea]/20 transition-all">
										Save Data
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Siblings */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<button type="button" onClick={() => setSiblingsOpen(!siblingsOpen)} className="flex items-center gap-3 w-full text-left">
					<span className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
						<span className="text-[#4359ea] text-lg">🐾</span>
					</span>
					<div className="flex-1 flex items-center gap-2">
						<h3 className="text-sm font-bold text-gray-900">Siblings Information</h3>
					</div>
					<div className="ml-2">
						{siblingsOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
					</div>
				</button>
				
				{siblingsOpen && (
					<div className="mt-5 border-t border-gray-50 pt-5">
						<div className="flex gap-4 overflow-x-auto pb-4 snap-x">
							{family.siblings.map((item) => (
								<div 
									key={item.id} 
									onClick={() => { setTempCat(item); setActiveModal("sibling"); }}
									className="snap-start shrink-0 w-[160px] border border-gray-200 rounded-2xl p-4 flex flex-col items-center bg-white shadow-sm relative group cursor-pointer hover:border-[#4359ea]/50 transition-all"
								>
									<button type="button" onClick={(e) => removeSibling(item.id, e)} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all z-10">
										<Trash2 size={14} />
									</button>

									<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3 relative">
										🐱
										<div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${item.gender === "Female" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
											{item.gender === "Female" ? "♀" : "♂"}
										</div>
									</div>

									<div className="w-full text-center space-y-1">
										<p className="text-sm font-bold text-gray-900 truncate">{item.name || "Unnamed"}</p>
										{item.dateOfBirth && <p className="text-[10px] font-medium text-gray-500">{new Date(item.dateOfBirth).toLocaleDateString()}</p>}
										{item.id && <p className="text-[10px] font-medium text-gray-500 truncate">ID: {item.id}</p>}
									</div>
								</div>
							))}
							
							<button type="button" onClick={() => { setTempCat({ id: "", name: "", gender: "Male", dateOfBirth: "" }); setActiveModal("sibling"); }} className="snap-start shrink-0 w-[140px] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:bg-[#4359ea]/5 hover:text-[#4359ea] hover:border-[#4359ea]/40 transition-all min-h-[160px]">
								<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-1">
									<Plus size={16} strokeWidth={3} />
								</div>
								<span className="text-xs font-bold text-gray-500">Add {family.siblings.length > 0 ? "More" : "Sibling"}</span>
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Grandparents */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<button type="button" onClick={() => setGrandparentsOpen(!grandparentsOpen)} className="flex items-center gap-3 w-full text-left">
					<span className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
						<span className="text-purple-600 text-lg">👴</span>
					</span>
					<div className="flex-1 flex flex-col items-start gap-0.5">
						<h3 className="text-sm font-bold text-gray-900">Grandparents Information</h3>
						{!grandparentsOpen && (family.maternalGrandfather || family.paternalGrandfather) && (
							<span className="text-xs text-gray-500 font-medium">Data Saved</span>
						)}
					</div>
					<div className="ml-2">
						{grandparentsOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
					</div>
				</button>
				
				{grandparentsOpen && (
					<div className="mt-5 border-t border-gray-50 pt-5 space-y-6">
						<div className="flex gap-4">
							<div className="w-1.5 rounded-full bg-pink-400 shrink-0" />
							<div className="flex-1 space-y-3">
								<p className="text-[11px] font-extrabold text-pink-600 uppercase tracking-widest">Maternal</p>
								
								{/* Grandfather */}
								<div className="flex items-center gap-3">
									<div className="flex-1 border border-gray-200 rounded-xl px-4 py-2 bg-white focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 transition-all">
										<label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Grandfather</label>
										<input type="text" value={family.maternalGrandfather} onChange={(e) => updateFamilyTree({ maternalGrandfather: e.target.value })} placeholder="Name / ID" className="w-full text-sm font-semibold text-gray-900 placeholder:text-gray-300 outline-none bg-transparent" />
									</div>
									<button type="button" onClick={() => updateFamilyTree({ maternalGrandfather: "" })} className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shrink-0"><Trash2 size={16} /></button>
								</div>
								
								{/* Grandmother */}
								<div className="flex items-center gap-3">
									<div className="flex-1 border border-gray-200 rounded-xl px-4 py-2 bg-white focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 transition-all">
										<label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Grandmother</label>
										<input type="text" value={family.maternalGrandmother} onChange={(e) => updateFamilyTree({ maternalGrandmother: e.target.value })} placeholder="Name / ID" className="w-full text-sm font-semibold text-gray-900 placeholder:text-gray-300 outline-none bg-transparent" />
									</div>
									<button type="button" onClick={() => updateFamilyTree({ maternalGrandmother: "" })} className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shrink-0"><Trash2 size={16} /></button>
								</div>
							</div>
						</div>
						
						<div className="h-px bg-gray-100 w-full" />

						<div className="flex gap-4">
							<div className="w-1.5 rounded-full bg-blue-400 shrink-0" />
							<div className="flex-1 space-y-3">
								<p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">Paternal</p>
								
								{/* Grandfather */}
								<div className="flex items-center gap-3">
									<div className="flex-1 border border-gray-200 rounded-xl px-4 py-2 bg-white focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 transition-all">
										<label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Grandfather</label>
										<input type="text" value={family.paternalGrandfather} onChange={(e) => updateFamilyTree({ paternalGrandfather: e.target.value })} placeholder="Name / ID" className="w-full text-sm font-semibold text-gray-900 placeholder:text-gray-300 outline-none bg-transparent" />
									</div>
									<button type="button" onClick={() => updateFamilyTree({ paternalGrandfather: "" })} className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shrink-0"><Trash2 size={16} /></button>
								</div>

								{/* Grandmother */}
								<div className="flex items-center gap-3">
									<div className="flex-1 border border-gray-200 rounded-xl px-4 py-2 bg-white focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 transition-all">
										<label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Grandmother</label>
										<input type="text" value={family.paternalGrandmother} onChange={(e) => updateFamilyTree({ paternalGrandmother: e.target.value })} placeholder="Name / ID" className="w-full text-sm font-semibold text-gray-900 placeholder:text-gray-300 outline-none bg-transparent" />
									</div>
									<button type="button" onClick={() => updateFamilyTree({ paternalGrandmother: "" })} className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shrink-0"><Trash2 size={16} /></button>
								</div>
							</div>
						</div>
						<div className="mt-6 flex justify-end">
							<button type="button" onClick={() => setGrandparentsOpen(false)} className="px-8 py-3 bg-[#4359ea] text-white font-bold rounded-xl text-sm hover:bg-[#3348d4] shadow-md shadow-[#4359ea]/20 transition-all">
								Save Data
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Offspring */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<button type="button" onClick={() => setOffspringOpen(!offspringOpen)} className="flex items-center gap-3 w-full text-left">
					<span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
						<span className="text-orange-500 text-lg">🍼</span>
					</span>
					<div className="flex-1 flex items-center gap-2">
						<h3 className="text-sm font-bold text-gray-900">Offspring Information</h3>
						<span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600">
							For Breeders Only
						</span>
					</div>
					<div className="ml-2">
						{offspringOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
					</div>
				</button>
				
				{offspringOpen && (
					<div className="mt-5 border-t border-gray-50 pt-5">
						<div className="flex gap-4 overflow-x-auto pb-4 snap-x">
							{family.offspring.map((item) => (
								<div 
									key={item.id} 
									onClick={() => { setTempCat(item); setActiveModal("offspring"); }}
									className="snap-start shrink-0 w-[160px] border border-gray-200 rounded-2xl p-4 flex flex-col items-center bg-white shadow-sm relative group cursor-pointer hover:border-[#4359ea]/50 transition-all"
								>
									<button type="button" onClick={(e) => removeOffspring(item.id, e)} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all z-10">
										<Trash2 size={14} />
									</button>

									<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3 relative">
										🐱
										<div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${item.gender === "Female" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
											{item.gender === "Female" ? "♀" : "♂"}
										</div>
									</div>

									<div className="w-full text-center space-y-1">
										<p className="text-sm font-bold text-gray-900 truncate">{item.name || "Unnamed"}</p>
										{item.dateOfBirth && <p className="text-[10px] font-medium text-gray-500">{new Date(item.dateOfBirth).toLocaleDateString()}</p>}
										{item.id && <p className="text-[10px] font-medium text-gray-500 truncate">ID: {item.id}</p>}
									</div>
								</div>
							))}
							
							<button type="button" onClick={() => { setTempCat({ id: "", name: "", gender: "Male", dateOfBirth: "" }); setActiveModal("offspring"); }} className="snap-start shrink-0 w-[140px] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:bg-[#4359ea]/5 hover:text-[#4359ea] hover:border-[#4359ea]/40 transition-all min-h-[160px]">
								<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-1">
									<Plus size={16} strokeWidth={3} />
								</div>
								<span className="text-xs font-bold text-gray-500">Add {family.offspring.length > 0 ? "More" : "Offspring"}</span>
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Pedigree Document */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<button type="button" onClick={() => setPedigreeOpen(!pedigreeOpen)} className="flex items-center gap-3 w-full text-left">
					<span className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
						<span className="text-teal-600 text-lg">📜</span>
					</span>
					<div className="flex-1 flex items-center gap-2">
						<h3 className="text-sm font-bold text-gray-900">Pedigree Document</h3>
						<span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
							Optional
						</span>
					</div>
					<div className="ml-2">
						{pedigreeOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
					</div>
				</button>
				
				{pedigreeOpen && (
					<div className="mt-5 border-t border-gray-50 pt-5 space-y-5">
						<div 
							onClick={() => fileInputRef.current?.click()}
							className="border-2 border-dashed border-gray-300 bg-white hover:bg-teal-50/50 hover:border-teal-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
						>
							<div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
								<CloudUpload size={28} className="text-teal-500" />
							</div>
							<span className="text-sm font-extrabold text-gray-900 block mb-1">
								{family.pedigreeDocument.file ? family.pedigreeDocument.file.name : "Upload pedigree document"}
							</span>
							<span className="text-xs text-gray-500 font-medium max-w-[200px] leading-relaxed">Drag and drop file here or click to browse. PDF, JPG, PNG (Max 10MB)</span>
							<input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileUpload} />
						</div>

						<div className="border border-gray-200 rounded-xl px-4 py-2 bg-white focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 transition-all">
							<label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Number of Generations Covered</label>
							<select value={family.pedigreeDocument.generations} onChange={(e) => updateFamilyTree({ pedigreeDocument: { ...family.pedigreeDocument, generations: e.target.value } })} className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none cursor-pointer appearance-none">
								<option value="" disabled className="text-gray-400 font-medium">Select generations</option>
								<option value="3">3 Generations</option>
								<option value="4">4 Generations</option>
								<option value="5">5 Generations</option>
								<option value="6+">6+ Generations</option>
							</select>
						</div>
					</div>
				)}
			</div>

			<div className="h-6" /> {/* Spacer */}

			{/* Modal for Sibling/Offspring Edit */}
			{activeModal && (
				<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4 transition-all">
					<div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
						<div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
						<h2 className="text-xl font-extrabold mb-1 text-gray-900">Add {activeModal === "sibling" ? "Sibling" : "Offspring"}</h2>
						<p className="text-sm text-gray-500 mb-6 font-medium">Enter the cat's details below.</p>

						<div className="space-y-4 mb-6">
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-gray-700 block">Name</label>
								<input type="text" value={tempCat.name} onChange={e => setTempCat({...tempCat, name: e.target.value})} className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#4359ea] focus:bg-white transition-all font-semibold" placeholder="Kitty Name" />
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-bold text-gray-700 block">Gender</label>
								<div className="flex gap-2">
									<button type="button" onClick={() => setTempCat({...tempCat, gender: "Male"})} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all border-2 ${tempCat.gender === "Male" ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-500"}`}>Male</button>
									<button type="button" onClick={() => setTempCat({...tempCat, gender: "Female"})} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all border-2 ${tempCat.gender === "Female" ? "border-pink-300 bg-pink-50 text-pink-700" : "border-gray-100 bg-gray-50 text-gray-500"}`}>Female</button>
								</div>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-bold text-gray-700 block">Date of Birth</label>
								<input type="date" value={tempCat.dateOfBirth} onChange={e => setTempCat({...tempCat, dateOfBirth: e.target.value})} className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#4359ea] focus:bg-white transition-all font-semibold" />
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-bold text-gray-700 block">ID (Optional)</label>
								<input type="text" value={tempCat.id} onChange={e => setTempCat({...tempCat, id: e.target.value})} className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#4359ea] focus:bg-white transition-all font-semibold" placeholder="e.g. REG-123" />
							</div>
						</div>

						<div className="flex gap-3 mt-auto">
							<button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-extrabold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
							<button type="button" onClick={handleSaveModal} className="flex-1 py-3.5 bg-[#4359ea] text-white font-extrabold rounded-xl hover:bg-[#3348d4] shadow-lg shadow-[#4359ea]/30 transition-all">Save Data</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

/* ================================================================
   FULL SCREEN — mobile / tablet view
   ================================================================ */
export default function FamilyTreeStep() {
	const router = useRouter();
	const {
		currentStep,
		goBack,
		isFirstStep,
		isLastStep,
	} = useRegisterCat();
	const { handleSubmit, isSubmitting } = useSubmitCat();

	const handleSkip = () => {
		router.push("/");
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<StepHeader stepIndex={currentStep} onBack={goBack} />

			<div className="flex-1 bg-white -mt-6 rounded-t-[40px] px-5 pt-8 pb-32 sm:px-8 shadow-sm relative z-20">
				<div className="max-w-2xl mx-auto space-y-6">
					<StepProgressBar stepIndex={currentStep} />
					<FamilyTreeFields />
				</div>
			</div>

			<StepNavButtons
				onBack={goBack}
				onNext={handleSubmit}
				isFirstStep={isFirstStep}
				isLastStep={isLastStep}
				showSkip={true}
				onSkip={handleSkip}
				nextLabel="Submit"
				isLoading={isSubmitting}
			/>
		</div>
	);
}

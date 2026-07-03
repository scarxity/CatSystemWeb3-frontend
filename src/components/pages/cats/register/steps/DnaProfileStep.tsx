"use client";

import { useRegisterCat } from "../context/RegisterCatContext";
import StepHeader from "../components/StepHeader";
import StepNavButtons from "../components/StepNavButtons";
import StepProgressBar from "../components/StepProgressBar";

import { useState } from "react";
import {
	Info,
	PieChart,
	Dna,
	ArrowRight,
	ArrowLeft,
	Microscope,
	TestTube2,
	ShieldCheck,
	Lock,
	Check,
	Link,
	FolderDown,
	Star,
} from "lucide-react";

/* ================================================================
   FIELDS ONLY — used by the desktop layout panel & mobile view
   ================================================================ */
export function DnaProfileFields() {
	const { formData, updateDnaProfile } = useRegisterCat();
	const dna = formData.dnaProfile;

	// Modal states
	const [activeModal, setActiveModal] = useState<"breed" | "purity" | "traits" | "markers" | null>(null);

	// Temp states for modals
	const [tempBreedComp, setTempBreedComp] = useState([...dna.breedComposition]);
	const [tempPurity, setTempPurity] = useState(dna.purityScore);
	const [tempTraits, setTempTraits] = useState([...dna.geneticTraits]);
	const [tempMarkers, setTempMarkers] = useState([...dna.geneticMarkers]);

	const hasComposition = dna.breedComposition.length > 0;
	const PIE_COLORS = ["#3b82f6", "#a855f7", "#14b8a6", "#f59e0b", "#ec4899"];

	let currentAngle = 0;
	const conicStops = dna.breedComposition
		.map((b, i) => {
			const start = currentAngle;
			currentAngle += b.percentage;
			return `${PIE_COLORS[i % PIE_COLORS.length]} ${start}% ${currentAngle}%`;
		})
		.join(", ");

	// Handlers for Breed Modal
	const handleOpenBreedModal = () => {
		setTempBreedComp(dna.breedComposition.length > 0 ? [...dna.breedComposition] : [{ name: "", percentage: 100 }]);
		setActiveModal("breed");
	};

	const addBreedRow = () => {
		setTempBreedComp([...tempBreedComp, { name: "", percentage: 0 }]);
	};

	const updateBreedRow = (index: number, field: "name" | "percentage", value: string | number) => {
		const updated = [...tempBreedComp];
		updated[index] = { ...updated[index], [field]: value };
		setTempBreedComp(updated);
	};

	const removeBreedRow = (index: number) => {
		setTempBreedComp(tempBreedComp.filter((_, i) => i !== index));
	};

	const handleSaveBreed = () => {
		const total = tempBreedComp.reduce((sum, b) => sum + (Number(b.percentage) || 0), 0);
		if (total !== 100) {
			alert(`Total percentage must be exactly 100%. Currently: ${total}%`);
			return;
		}
		const cleanComp = tempBreedComp.filter(b => b.name.trim() !== "" && b.percentage > 0);
		updateDnaProfile({ breedComposition: cleanComp });
		setActiveModal(null);
	};

	// Handlers for Purity Modal
	const handleOpenPurityModal = () => {
		setTempPurity(dna.purityScore);
		setActiveModal("purity");
	};

	const handleSavePurity = () => {
		updateDnaProfile({ purityScore: tempPurity });
		setActiveModal(null);
	};

	// Handlers for Traits Modal
	const handleOpenTraitsModal = () => {
		setTempTraits([...dna.geneticTraits]);
		setActiveModal("traits");
	};

	const addTrait = () => {
		setTempTraits([...tempTraits, ""]);
	};

	const updateTrait = (index: number, value: string) => {
		const updated = [...tempTraits];
		updated[index] = value;
		setTempTraits(updated);
	};

	const removeTrait = (index: number) => {
		setTempTraits(tempTraits.filter((_, i) => i !== index));
	};

	const handleSaveTraits = () => {
		const cleanTraits = tempTraits.filter(t => t.trim() !== "");
		updateDnaProfile({ geneticTraits: cleanTraits });
		setActiveModal(null);
	};

	// Handlers for Markers Modal
	const handleOpenMarkersModal = () => {
		setTempMarkers(dna.geneticMarkers.length > 0 ? [...dna.geneticMarkers] : [{ name: "", variant: "" }]);
		setActiveModal("markers");
	};

	const addMarker = () => {
		setTempMarkers([...tempMarkers, { name: "", variant: "" }]);
	};

	const updateMarker = (index: number, field: "name" | "variant", value: string) => {
		const updated = [...tempMarkers];
		updated[index] = { ...updated[index], [field]: value };
		setTempMarkers(updated);
	};

	const removeMarker = (index: number) => {
		setTempMarkers(tempMarkers.filter((_, i) => i !== index));
	};

	const handleSaveMarkers = () => {
		const cleanMarkers = tempMarkers.filter(m => m.name.trim() !== "" && m.variant.trim() !== "");
		updateDnaProfile({ geneticMarkers: cleanMarkers });
		setActiveModal(null);
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-5 space-y-5">
			{/* Info banner */}
			<div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
				<Info size={18} className="text-orange-500 shrink-0 mt-0.5" />
				<p className="text-sm text-orange-800 font-medium">
					This section is optional. You can skip and add it later.
				</p>
			</div>

			{/* STEP 3 INPUT CARDS */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Breed Composition Card */}
				<div className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow relative bg-white">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<PieChart size={20} className="text-[#3b82f6]" />
							<h3 className="text-sm font-bold text-gray-900">Breed Composition</h3>
						</div>
						<button
							type="button"
							onClick={handleOpenBreedModal}
							className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
						>
							<ArrowRight size={16} className="text-[#a855f7]" />
						</button>
					</div>

					{!hasComposition ? (
						<p className="text-xs text-gray-400 py-4">No DNA data added yet. Click the arrow to add.</p>
					) : (
						<div className="flex items-center justify-between mt-2">
							<div className="space-y-2.5 flex-1 pr-4">
								{dna.breedComposition.map((b, i) => (
									<div key={i} className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-2">
											<span
												className="w-2.5 h-2.5 rounded-full"
												style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
											/>
											<span className="text-gray-700 font-medium truncate max-w-[150px]">{b.name}</span>
										</div>
										<span className="font-bold text-gray-900">{b.percentage}%</span>
									</div>
								))}
							</div>
							<div
								className="w-20 h-20 rounded-full shrink-0 shadow-inner"
								style={{ background: conicStops ? `conic-gradient(${conicStops})` : "#f3f4f6" }}
							/>
						</div>
					)}
				</div>

				{/* Purity Score Card */}
				<div className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow relative bg-white">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<Dna size={20} className="text-green-500" />
							<h3 className="text-sm font-bold text-gray-900">Purity Score</h3>
						</div>
						<button
							type="button"
							onClick={handleOpenPurityModal}
							className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
						>
							<ArrowRight size={16} className="text-green-500" />
						</button>
					</div>

					<div className="flex items-center gap-4 mt-6">
						<span className="text-4xl font-extrabold text-green-500">
							{dna.purityScore}%
						</span>
						<div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
							<div
								className="h-full bg-green-500 rounded-full transition-all duration-500"
								style={{ width: `${dna.purityScore}%` }}
							/>
						</div>
					</div>
				</div>

				{/* Genetic Traits Card */}
				<div className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white col-span-1 md:col-span-2">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<Microscope size={20} className="text-purple-500" />
							<h3 className="text-sm font-bold text-gray-900">Genetic Traits</h3>
						</div>
						<button
							type="button"
							onClick={handleOpenTraitsModal}
							className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
						>
							<ArrowRight size={16} className="text-purple-500" />
						</button>
					</div>

					{dna.geneticTraits.length === 0 ? (
						<p className="text-xs text-gray-400 py-4">No genetic traits recorded yet. Click the arrow to add.</p>
					) : (
						<div className="flex flex-wrap gap-3 mt-2">
							{dna.geneticTraits.map((trait, i) => (
								<div key={i} className="flex flex-col gap-1 border border-purple-100 bg-white rounded-xl p-3 shadow-sm min-w-[120px]">
									<span className="text-sm font-bold text-gray-800">{trait}</span>
									<div className="flex items-center gap-1.5 mt-1">
										<div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">
											✓
										</div>
										<span className="text-xs font-semibold text-green-600">Present</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Genetic Markers Card */}
				<div className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white col-span-1 md:col-span-2">
					<div className="flex items-start justify-between mb-2">
						<div className="flex gap-3">
							<div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
								<TestTube2 size={20} className="text-blue-500" />
							</div>
							<div>
								<h3 className="text-sm font-bold text-gray-900">Genetic Markers</h3>
								<p className="text-xs text-gray-500 mt-0.5">SNP markers and genetic variants detected</p>
							</div>
						</div>
						<button
							type="button"
							onClick={handleOpenMarkersModal}
							className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0"
						>
							<ArrowRight size={16} className="text-blue-600" />
						</button>
					</div>

					{dna.geneticMarkers.length === 0 ? (
						<p className="text-xs text-gray-400 py-4 ml-13">No genetic markers recorded yet.</p>
					) : (
						<div className="mt-4 space-y-0">
							{dna.geneticMarkers.map((m, i) => (
								<div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
									<span className="text-sm font-bold text-gray-800">{m.name}</span>
									<span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
										{m.variant}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* DNA Summary Card */}
			<div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm mt-8">
				<div className="flex items-center gap-3 mb-5">
					<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
						<Dna size={16} className="text-purple-600" />
					</div>
					<h3 className="text-base font-extrabold text-gray-900">1. DNA SUMMARY</h3>
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-between py-2 border-b border-gray-50">
						<div className="flex items-center gap-3 text-gray-600">
							<Microscope size={18} className="text-purple-500" />
							<span className="text-sm font-medium">Cat Name</span>
						</div>
						<span className="text-sm font-bold text-gray-900">{formData.basicInfo.catName || "-"}</span>
					</div>
					<div className="flex items-center justify-between py-2 border-b border-gray-50">
						<div className="flex items-center gap-3 text-gray-600">
							<ShieldCheck size={18} className="text-purple-500" />
							<span className="text-sm font-medium">Breed</span>
						</div>
						<span className="text-sm font-bold text-gray-900 text-right max-w-[200px] truncate">
							{dna.breedComposition.length > 0 ? dna.breedComposition.map(b => `${b.name} (${b.percentage}%)`).join(", ") : "-"}
						</span>
					</div>
					<div className="flex items-center justify-between py-2 border-b border-gray-50">
						<div className="flex items-center gap-3 text-gray-600">
							<Star size={18} className="text-blue-500" />
							<span className="text-sm font-medium">Purity Score</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm font-extrabold text-blue-600">{dna.purityScore}%</span>
							<div 
								className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" 
								style={{ background: `conic-gradient(#3b82f6 ${dna.purityScore}%, #eff6ff 0)` }}
							>
								<div className="w-3.5 h-3.5 bg-white rounded-full" />
							</div>
						</div>
					</div>
					<div className="flex items-center justify-between py-2 border-b border-gray-50">
						<div className="flex items-center gap-3 text-gray-600">
							<Dna size={18} className="text-teal-500" />
							<span className="text-sm font-medium">Genetic Traits</span>
						</div>
						<span className="text-sm font-bold text-gray-900">{dna.geneticTraits.length} traits detected</span>
					</div>
					<div className="flex items-center justify-between py-2">
						<div className="flex items-center gap-3 text-gray-600">
							<TestTube2 size={18} className="text-blue-500" />
							<span className="text-sm font-medium">Genetic Markers</span>
						</div>
						<span className="text-sm font-bold text-gray-900">{dna.geneticMarkers.length} markers detected</span>
					</div>
				</div>
			</div>

			{/* Save to Blockchain Card (Web3 CTA) */}
			<div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 sm:p-8 shadow-lg shadow-indigo-100/50 mt-4">
				{/* Background decorative blobs */}
				<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
				<div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
				
				<div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
					{/* Left: 3D-ish Shield Icon */}
					<div className="flex-shrink-0 relative group">
						<div className="absolute inset-0 bg-gradient-to-br from-[#4359ea] to-[#9b5de5] blur-xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
						<div className="relative w-28 h-28 bg-gradient-to-b from-white to-indigo-50 border border-white rounded-3xl shadow-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
							<div className="absolute inset-2 border border-dashed border-indigo-200 rounded-2xl" />
							<div className="relative bg-gradient-to-br from-[#4359ea] to-[#5b35d4] w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">
								<ShieldCheck size={32} className="text-white drop-shadow-md" />
							</div>
						</div>
					</div>

					{/* Right: Content & Actions */}
					<div className="flex-1 text-center md:text-left">						
						<h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
							Save DNA Profile to Blockchain
						</h3>
						<p className="text-sm text-gray-500 mb-6 leading-relaxed">
							Store your cat's DNA data immutably on the blockchain for permanent verification, trust, and transparent history.
						</p>

						{/* Features 2x2 Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
							{[
								"Immutable Record",
								"Permanent Verification",
								"Shareable Blockchain ID",
								"Transparent History"
							].map((feature, i) => (
								<div key={i} className="flex items-center gap-2">
									<div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
										<Check size={12} strokeWidth={3} className="text-green-600" />
									</div>
									<span className="text-sm font-semibold text-gray-700">{feature}</span>
								</div>
							))}
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3">
							<button
								type="button"
								className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 bg-gradient-to-r from-[#4359ea] to-[#5b35d4] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#4359ea]/30 hover:opacity-90 active:scale-[0.98] transition-all"
								onClick={() => alert("Save to Blockchain (Smart Contract interaction) will be triggered here!")}
							>
								<Link size={18} />
								Save to Blockchain
							</button>
							<button
								type="button"
								className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 active:scale-[0.98] transition-all"
								onClick={() => alert("Saved Locally!")}
							>
								<FolderDown size={18} />
								Save Locally Only
							</button>
						</div>
						
						{/* Footer Note */}
						<div className="flex items-center justify-center md:justify-start gap-1.5 mt-4 text-xs font-medium text-gray-400">
							<Info size={12} />
							<span>This will create a permanent record on the Solana blockchain.</span>
						</div>
					</div>
				</div>
			</div>

			{/* Breed Composition Modal */}
			{activeModal === "breed" && (
				<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4 transition-all">
					<div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
						<div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
						<h2 className="text-xl font-extrabold mb-1">Edit Breed Composition</h2>
						<p className="text-sm text-gray-500 mb-6">Ensure total percentage equals 100%.</p>
						
						<div className="flex-1 overflow-y-auto space-y-3 mb-5 pr-2">
							{tempBreedComp.map((b, i) => (
								<div key={i} className="flex items-center gap-2">
									<div className="flex-1">
										<input
											type="text"
											value={b.name}
											onChange={(e) => updateBreedRow(i, "name", e.target.value)}
											placeholder="Breed name"
											className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#4359ea] focus:ring-2 focus:ring-[#4359ea]/30 outline-none transition-all"
										/>
									</div>
									<div className="w-24 shrink-0">
										<div className="relative">
											<input
												type="number"
												min="0"
												max="100"
												value={b.percentage}
												onChange={(e) => updateBreedRow(i, "percentage", parseInt(e.target.value) || 0)}
												className="w-full h-11 px-3 pr-7 rounded-xl border border-gray-200 text-sm text-right focus:border-[#4359ea] focus:ring-2 focus:ring-[#4359ea]/30 outline-none transition-all"
											/>
											<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
										</div>
									</div>
									<button
										type="button"
										onClick={() => removeBreedRow(i)}
										disabled={tempBreedComp.length === 1}
										className="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 shrink-0 transition-colors"
									>
										✕
									</button>
								</div>
							))}
						</div>

						<div className="mb-6 flex items-center justify-between">
							<button
								type="button"
								onClick={addBreedRow}
								className="text-sm font-bold text-[#4359ea] hover:text-[#3348d4] flex items-center gap-1"
							>
								+ Add another breed
							</button>
							<span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${tempBreedComp.reduce((s,b)=>s+(Number(b.percentage)||0),0) === 100 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
								Total: {tempBreedComp.reduce((s,b)=>s+(Number(b.percentage)||0),0)}%
							</span>
						</div>

						<div className="flex gap-3 mt-auto">
							<button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
								Cancel
							</button>
							<button type="button" onClick={handleSaveBreed} className="flex-1 py-3.5 bg-[#4359ea] text-white font-bold rounded-xl hover:opacity-90 shadow-md shadow-[#4359ea]/20 transition-all">
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Purity Score Modal */}
			{activeModal === "purity" && (
				<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4 transition-all">
					<div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col">
						<div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
						<h2 className="text-xl font-extrabold mb-1">Edit Purity Score</h2>
						<p className="text-sm text-gray-500 mb-8">Drag the slider to set the purity percentage.</p>
						
						<div className="flex items-center gap-5 mb-10">
							<input
								type="range"
								min="0"
								max="100"
								value={tempPurity}
								onChange={(e) => setTempPurity(parseInt(e.target.value))}
								className="flex-1 accent-green-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							/>
							<div className="w-20 relative shrink-0">
								<input
									type="number"
									min="0"
									max="100"
									value={tempPurity}
									onChange={(e) => setTempPurity(parseInt(e.target.value) || 0)}
									className="w-full h-12 pl-2 pr-6 rounded-xl border border-gray-200 text-base font-bold text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition-all"
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
							</div>
						</div>

						<div className="flex gap-3 mt-auto">
							<button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
								Cancel
							</button>
							<button type="button" onClick={handleSavePurity} className="flex-1 py-3.5 bg-green-500 text-white font-bold rounded-xl hover:opacity-90 shadow-md shadow-green-500/20 transition-all">
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Genetic Traits Modal */}
			{activeModal === "traits" && (
				<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4 transition-all">
					<div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
						<div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
						<h2 className="text-xl font-extrabold mb-1">Edit Genetic Traits</h2>
						<p className="text-sm text-gray-500 mb-6">Add physical traits detected in DNA.</p>
						
						<div className="flex-1 overflow-y-auto space-y-3 mb-5 pr-2">
							{tempTraits.map((t, i) => (
								<div key={i} className="flex items-center gap-2">
									<input
										type="text"
										value={t}
										onChange={(e) => updateTrait(i, e.target.value)}
										placeholder="e.g. Long Hair, Curled Ears"
										className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
									/>
									<button
										type="button"
										onClick={() => removeTrait(i)}
										className="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 shrink-0 transition-colors"
									>
										✕
									</button>
								</div>
							))}
							{tempTraits.length === 0 && (
								<div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
									<p className="text-sm text-gray-400">No traits added yet.</p>
								</div>
							)}
						</div>

						<button
							type="button"
							onClick={addTrait}
							className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 mb-6"
						>
							+ Add another trait
						</button>

						<div className="flex gap-3 mt-auto">
							<button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
								Cancel
							</button>
							<button type="button" onClick={handleSaveTraits} className="flex-1 py-3.5 bg-purple-600 text-white font-bold rounded-xl hover:opacity-90 shadow-md shadow-purple-600/20 transition-all">
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Genetic Markers Modal */}
			{activeModal === "markers" && (
				<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4 transition-all">
					<div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
						<div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
						<h2 className="text-xl font-extrabold mb-1">Edit Genetic Markers</h2>
						<p className="text-sm text-gray-500 mb-6">Add SNP markers and variants.</p>
						
						<div className="flex-1 overflow-y-auto space-y-4 mb-5 pr-2">
							{tempMarkers.map((m, i) => (
								<div key={i} className="flex gap-2">
									<div className="flex-1 grid grid-cols-2 gap-2">
										<input
											type="text"
											value={m.name}
											onChange={(e) => updateMarker(i, "name", e.target.value)}
											placeholder="Marker ID"
											className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
										/>
										<input
											type="text"
											value={m.variant}
											onChange={(e) => updateMarker(i, "variant", e.target.value)}
											placeholder="Variant"
											className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
										/>
									</div>
									<button
										type="button"
										onClick={() => removeMarker(i)}
										className="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 shrink-0 transition-colors"
									>
										✕
									</button>
								</div>
							))}
							{tempMarkers.length === 0 && (
								<div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
									<p className="text-sm text-gray-400">No markers added yet.</p>
								</div>
							)}
						</div>

						<button
							type="button"
							onClick={addMarker}
							className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-6"
						>
							+ Add another marker
						</button>

						<div className="flex gap-3 mt-auto">
							<button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
								Cancel
							</button>
							<button type="button" onClick={handleSaveMarkers} className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:opacity-90 shadow-md shadow-blue-600/20 transition-all">
								Save
							</button>
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
export default function DnaProfileStep() {
	const { currentStep, goNext, goBack, isFirstStep, isLastStep, canProceed } = useRegisterCat();

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<StepHeader stepIndex={currentStep} onBack={goBack} />

			<div className="flex-1 bg-white -mt-6 rounded-t-[40px] px-5 pt-8 pb-32 sm:px-8 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] relative">
				<div className="max-w-2xl mx-auto space-y-6">
					<StepProgressBar stepIndex={currentStep} />
					
					{/* Re-use the responsive sliced fields */}
					<DnaProfileFields />
				</div>
			</div>

			<StepNavButtons
				onBack={goBack}
				onNext={goNext}
				onSkip={goNext}
				showSkip
				isFirstStep={isFirstStep}
				isLastStep={isLastStep}
				canProceed={canProceed}
			/>
		</div>
	);
}

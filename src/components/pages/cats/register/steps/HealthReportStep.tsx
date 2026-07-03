"use client";

import { useRegisterCat } from "../context/RegisterCatContext";
import StepHeader from "../components/StepHeader";
import StepNavButtons from "../components/StepNavButtons";
import StepProgressBar from "../components/StepProgressBar";

import { useState } from "react";
import {
	ChevronDown,
	ChevronUp,
	Pencil,
	Plus,
	Trash2,
	Calendar,
	User,
	Weight,
	ShieldCheck,
	Syringe,
	Stethoscope,
	TriangleAlert,
	HeartPulse,
	Check,
} from "lucide-react";
import type { Vaccination } from "@/types/registerCat";

/* ================================================================
   FIELDS ONLY — used by the desktop layout panel & mobile view
   ================================================================ */

// Helper component for Accordion Header
const AccordionHeader = ({
	icon,
	title,
	subtitle,
	isOpen,
	onToggle,
	badge,
	accentColor = "text-[#4359ea]",
	bgColor = "bg-blue-50",
}: {
	icon: React.ReactNode;
	title: string;
	subtitle?: string;
	isOpen: boolean;
	onToggle: () => void;
	badge?: React.ReactNode;
	accentColor?: string;
	bgColor?: string;
}) => (
	<button
		type="button"
		onClick={onToggle}
		className="flex items-center gap-3 w-full text-left"
	>
		<span className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center shrink-0`}>
			{icon}
		</span>
		<div className="flex-1">
			<h3 className={`text-sm font-bold ${accentColor}`}>{title}</h3>
			{subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
		</div>
		{badge && <div>{badge}</div>}
		<div className="ml-2">
			{isOpen ? (
				<ChevronUp size={18} className="text-gray-400" />
			) : (
				<ChevronDown size={18} className="text-gray-400" />
			)}
		</div>
	</button>
);

export function HealthReportFields() {
	const { formData, updateHealthReport } = useRegisterCat();
	const health = formData.healthReport;

	const [vaccinationOpen, setVaccinationOpen] = useState(true);
	const [medicalOpen, setMedicalOpen] = useState(false);
	const [risksOpen, setRisksOpen] = useState(false);
	const [checkupOpen, setCheckupOpen] = useState(true);

	// Inline editing states
	const [editingVacId, setEditingVacId] = useState<string | null>(null);
	const [isAddingVac, setIsAddingVac] = useState(false);
	const [tempVac, setTempVac] = useState<Vaccination>({ id: "", name: "", date: "" });

	const [editingMedIndex, setEditingMedIndex] = useState<number | null>(null);
	const [isAddingMed, setIsAddingMed] = useState(false);
	const [tempMed, setTempMed] = useState("");

	const [editingRiskIndex, setEditingRiskIndex] = useState<number | null>(null);
	const [isAddingRisk, setIsAddingRisk] = useState(false);
	const [tempRisk, setTempRisk] = useState("");

	const [isEditingCheckup, setIsEditingCheckup] = useState(false);
	const [tempCheckup, setTempCheckup] = useState({ ...health.lastCheckup });

	// ==================== VACCINATIONS ====================
	const handleSaveVac = () => {
		if (!tempVac.name.trim()) return;
		if (isAddingVac) {
			updateHealthReport({ vaccinations: [...health.vaccinations, { ...tempVac, id: crypto.randomUUID() }] });
			setIsAddingVac(false);
		} else {
			updateHealthReport({
				vaccinations: health.vaccinations.map(v => v.id === editingVacId ? tempVac : v)
			});
			setEditingVacId(null);
		}
	};

	const removeVaccination = (id: string) => {
		updateHealthReport({ vaccinations: health.vaccinations.filter((v) => v.id !== id) });
	};

	// ==================== MEDICAL HISTORY ====================
	const handleSaveMed = () => {
		if (!tempMed.trim()) return;
		if (isAddingMed) {
			updateHealthReport({ medicalHistory: [...health.medicalHistory, tempMed] });
			setIsAddingMed(false);
		} else if (editingMedIndex !== null) {
			const arr = [...health.medicalHistory];
			arr[editingMedIndex] = tempMed;
			updateHealthReport({ medicalHistory: arr });
			setEditingMedIndex(null);
		}
	};

	const removeMedical = (index: number) => {
		updateHealthReport({ medicalHistory: health.medicalHistory.filter((_, i) => i !== index) });
	};

	// ==================== HEALTH RISKS ====================
	const handleSaveRisk = () => {
		if (!tempRisk.trim()) return;
		if (isAddingRisk) {
			updateHealthReport({ healthRisks: [...health.healthRisks, tempRisk] });
			setIsAddingRisk(false);
		} else if (editingRiskIndex !== null) {
			const arr = [...health.healthRisks];
			arr[editingRiskIndex] = tempRisk;
			updateHealthReport({ healthRisks: arr });
			setEditingRiskIndex(null);
		}
	};

	const removeRisk = (index: number) => {
		updateHealthReport({ healthRisks: health.healthRisks.filter((_, i) => i !== index) });
	};

	// ==================== CHECKUP ====================
	const handleSaveCheckup = () => {
		updateHealthReport({ lastCheckup: tempCheckup });
		setIsEditingCheckup(false);
	};

	// Components extracted outside to prevent re-renders

	return (
		<div className="space-y-4">
			{/* 1. Vaccinations Card */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<AccordionHeader
					icon={<ShieldCheck size={20} className="text-purple-600" />}
					title="1. Vaccinations"
					subtitle="Record of all vaccinations"
					isOpen={vaccinationOpen}
					onToggle={() => setVaccinationOpen(!vaccinationOpen)}
					bgColor="bg-purple-100"
					accentColor="text-gray-900"
				/>

				{vaccinationOpen && (
					<div className="mt-5 space-y-4 border-t border-gray-50 pt-4">
						{health.vaccinations.length === 0 && !isAddingVac ? (
							<p className="text-xs text-gray-400 text-center py-2">No vaccinations recorded yet.</p>
						) : (
							<div className="space-y-3">
								{health.vaccinations.map((vac) => (
									<div key={vac.id}>
										{editingVacId === vac.id ? (
											<div className="bg-purple-50 p-3 rounded-xl border border-purple-100 space-y-2">
												<input
													type="text"
													value={tempVac.name}
													onChange={(e) => setTempVac({ ...tempVac, name: e.target.value })}
													className="w-full text-sm font-bold bg-white px-3 py-2 rounded-lg border border-purple-200 outline-none focus:border-purple-400"
												/>
												<input
													type="date"
													value={tempVac.date}
													onChange={(e) => setTempVac({ ...tempVac, date: e.target.value })}
													className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-purple-200 outline-none focus:border-purple-400"
												/>
												<div className="flex gap-2 pt-1">
													<button type="button" onClick={() => setEditingVacId(null)} className="flex-1 py-1.5 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg">Cancel</button>
													<button type="button" onClick={handleSaveVac} className="flex-1 py-1.5 text-xs font-bold text-white bg-purple-600 rounded-lg">Save</button>
												</div>
											</div>
										) : (
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
													<Syringe size={18} className="text-purple-500" />
												</div>
												<div className="flex-1">
													<h4 className="text-sm font-bold text-gray-900">{vac.name}</h4>
													<p className="text-[11px] font-medium text-gray-500">{vac.date ? new Date(vac.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "No date"}</p>
												</div>
												<div className="flex items-center gap-1 shrink-0">
													<button type="button" onClick={() => { setEditingVacId(vac.id); setTempVac(vac); }} className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
														<Pencil size={16} />
													</button>
													<button type="button" onClick={() => removeVaccination(vac.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
														<Trash2 size={16} />
													</button>
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						)}

						{isAddingVac ? (
							<div className="bg-purple-50 p-3 rounded-xl border border-purple-100 space-y-2 mt-4">
								<input
									type="text"
									value={tempVac.name}
									onChange={(e) => setTempVac({ ...tempVac, name: e.target.value })}
									placeholder="Vaccination Name (e.g., FVRCP)"
									className="w-full text-sm font-bold bg-white px-3 py-2 rounded-lg border border-purple-200 outline-none focus:border-purple-400"
								/>
								<input
									type="date"
									value={tempVac.date}
									onChange={(e) => setTempVac({ ...tempVac, date: e.target.value })}
									className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-purple-200 outline-none focus:border-purple-400"
								/>
								<div className="flex gap-2 pt-1">
									<button type="button" onClick={() => setIsAddingVac(false)} className="flex-1 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg">Cancel</button>
									<button type="button" onClick={handleSaveVac} className="flex-1 py-2 text-xs font-bold text-white bg-purple-600 rounded-lg">Save</button>
								</div>
							</div>
						) : (
							<button
								type="button"
								onClick={() => { setIsAddingVac(true); setTempVac({ id: "", name: "", date: "" }); }}
								className="w-full py-3.5 border-2 border-dashed border-purple-200 text-purple-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors text-sm"
							>
								<Plus size={16} /> Add Vaccination
							</button>
						)}
					</div>
				)}
			</div>

			{/* 2. Medical History Card */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<AccordionHeader
					icon={<Stethoscope size={20} className="text-blue-500" />}
					title="2. Medical History"
					isOpen={medicalOpen}
					onToggle={() => setMedicalOpen(!medicalOpen)}
					bgColor="bg-blue-50"
					accentColor="text-gray-900"
					badge={
						health.medicalHistory.length > 0 ? (
							<div className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full">
								{health.medicalHistory.length} Conditions
							</div>
						) : null
					}
				/>

				{medicalOpen && (
					<div className="mt-5 space-y-3 border-t border-gray-50 pt-4">
						{health.medicalHistory.length === 0 && !isAddingMed ? (
							<p className="text-xs text-gray-400 text-center py-2">No medical history recorded yet.</p>
						) : (
							<div className="space-y-2">
								{health.medicalHistory.map((item, i) => (
									<div key={i}>
										{editingMedIndex === i ? (
											<div className="flex gap-2">
												<input
													type="text"
													value={tempMed}
													onChange={(e) => setTempMed(e.target.value)}
													className="flex-1 h-9 px-3 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:border-blue-400"
												/>
												<button type="button" onClick={handleSaveMed} className="px-3 bg-blue-600 text-white rounded-lg text-xs font-bold"><Check size={16}/></button>
											</div>
										) : (
											<div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
												<span className="flex-1 text-sm font-bold text-gray-900">{item}</span>
												<button type="button" onClick={() => { setEditingMedIndex(i); setTempMed(item); }} className="text-blue-400 hover:text-blue-600 p-1">
													<Pencil size={14} />
												</button>
												<button type="button" onClick={() => removeMedical(i)} className="text-red-400 hover:text-red-600 p-1">
													<Trash2 size={14} />
												</button>
											</div>
										)}
									</div>
								))}
							</div>
						)}

						{isAddingMed ? (
							<div className="flex gap-2 mt-3">
								<input
									type="text"
									value={tempMed}
									onChange={(e) => setTempMed(e.target.value)}
									placeholder="e.g., Spayed/Neutered"
									className="flex-1 h-10 px-3 bg-white border border-blue-200 rounded-xl text-sm outline-none focus:border-blue-400"
									autoFocus
								/>
								<button type="button" onClick={handleSaveMed} className="px-4 bg-blue-600 text-white rounded-xl text-xs font-bold">Add</button>
							</div>
						) : (
							<button
								type="button"
								onClick={() => { setIsAddingMed(true); setTempMed(""); }}
								className="w-full py-3.5 border-2 border-dashed border-blue-200 text-blue-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors text-sm mt-2"
							>
								<Plus size={16} /> Add Medical Condition
							</button>
						)}
					</div>
				)}
			</div>

			{/* 3. Health Risks Card */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<AccordionHeader
					icon={<TriangleAlert size={20} className="text-orange-500" />}
					title="3. Health Risks"
					isOpen={risksOpen}
					onToggle={() => setRisksOpen(!risksOpen)}
					bgColor="bg-orange-50"
					accentColor="text-gray-900"
					badge={
						<div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100">
							<div className="flex items-center gap-1">
								<div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
								<div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
								<div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
							</div>
						</div>
					}
				/>

				{risksOpen && (
					<div className="mt-5 space-y-3 border-t border-gray-50 pt-4">
						{health.healthRisks.length === 0 && !isAddingRisk ? (
							<p className="text-xs text-gray-400 text-center py-2">No health risks recorded yet.</p>
						) : (
							<div className="space-y-2">
								{health.healthRisks.map((item, i) => (
									<div key={i}>
										{editingRiskIndex === i ? (
											<div className="flex gap-2">
												<input
													type="text"
													value={tempRisk}
													onChange={(e) => setTempRisk(e.target.value)}
													className="flex-1 h-9 px-3 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-400"
												/>
												<button type="button" onClick={handleSaveRisk} className="px-3 bg-orange-600 text-white rounded-lg text-xs font-bold"><Check size={16}/></button>
											</div>
										) : (
											<div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
												<span className="flex-1 text-sm font-bold text-gray-900">{item}</span>
												<button type="button" onClick={() => { setEditingRiskIndex(i); setTempRisk(item); }} className="text-orange-400 hover:text-orange-600 p-1">
													<Pencil size={14} />
												</button>
												<button type="button" onClick={() => removeRisk(i)} className="text-red-400 hover:text-red-600 p-1">
													<Trash2 size={14} />
												</button>
											</div>
										)}
									</div>
								))}
							</div>
						)}

						{isAddingRisk ? (
							<div className="flex gap-2 mt-3">
								<input
									type="text"
									value={tempRisk}
									onChange={(e) => setTempRisk(e.target.value)}
									placeholder="e.g., Genetic predisposition"
									className="flex-1 h-10 px-3 bg-white border border-orange-200 rounded-xl text-sm outline-none focus:border-orange-400"
									autoFocus
								/>
								<button type="button" onClick={handleSaveRisk} className="px-4 bg-orange-600 text-white rounded-xl text-xs font-bold">Add</button>
							</div>
						) : (
							<button
								type="button"
								onClick={() => { setIsAddingRisk(true); setTempRisk(""); }}
								className="w-full py-3.5 border-2 border-dashed border-orange-200 text-orange-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors text-sm mt-2"
							>
								<Plus size={16} /> Add Health Risk
							</button>
						)}
					</div>
				)}
			</div>

			{/* 4. Last Veterinary Checkup Card */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 transition-all">
				<AccordionHeader
					icon={<HeartPulse size={20} className="text-teal-600" />}
					title="4. Last Veterinary Checkup"
					isOpen={checkupOpen}
					onToggle={() => setCheckupOpen(!checkupOpen)}
					bgColor="bg-teal-50"
					accentColor="text-gray-900"
				/>

				{checkupOpen && (
					<div className="mt-5 border-t border-gray-50 pt-4">
						{isEditingCheckup ? (
							<div className="bg-teal-50 p-4 rounded-xl border border-teal-100 space-y-4">
								<div>
									<label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1">Date</label>
									<input type="date" value={tempCheckup.date} onChange={e => setTempCheckup({...tempCheckup, date: e.target.value})} className="w-full text-sm bg-white border border-teal-200 rounded-lg px-3 py-2 outline-none focus:border-teal-500" />
								</div>
								<div>
									<label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1">Veterinarian</label>
									<input type="text" value={tempCheckup.veterinarian} onChange={e => setTempCheckup({...tempCheckup, veterinarian: e.target.value})} className="w-full text-sm bg-white border border-teal-200 rounded-lg px-3 py-2 outline-none focus:border-teal-500" />
								</div>
								<div>
									<label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1">Weight</label>
									<input type="text" value={tempCheckup.weight} onChange={e => setTempCheckup({...tempCheckup, weight: e.target.value})} className="w-full text-sm bg-white border border-teal-200 rounded-lg px-3 py-2 outline-none focus:border-teal-500" />
								</div>
								<div>
									<label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1">Health Status</label>
									<select value={tempCheckup.healthStatus} onChange={e => setTempCheckup({...tempCheckup, healthStatus: e.target.value})} className="w-full text-sm bg-white border border-teal-200 rounded-lg px-3 py-2 outline-none focus:border-teal-500">
										<option value="">Select Status</option>
										<option value="Healthy">Healthy ✅</option>
										<option value="Needs Attention">Needs Attention ⚠️</option>
										<option value="Critical">Critical 🚨</option>
									</select>
								</div>
								<div className="flex gap-2 pt-2">
									<button type="button" onClick={() => setIsEditingCheckup(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg">Cancel</button>
									<button type="button" onClick={handleSaveCheckup} className="flex-1 py-2 bg-teal-600 text-white font-bold text-xs rounded-lg">Save Checkup</button>
								</div>
							</div>
						) : (
							<>
								<div className="grid grid-cols-2 gap-x-4 gap-y-6">
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
											<Calendar size={14} className="text-gray-500" />
										</div>
										<div className="flex flex-col">
											<span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Date</span>
											<span className="text-sm font-bold text-gray-900">{health.lastCheckup.date ? new Date(health.lastCheckup.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}</span>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
											<User size={14} className="text-gray-500" />
										</div>
										<div className="flex flex-col">
											<span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Veterinarian</span>
											<span className="text-sm font-bold text-gray-900 truncate">{health.lastCheckup.veterinarian || "-"}</span>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
											<Weight size={14} className="text-gray-500" />
										</div>
										<div className="flex flex-col">
											<span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Weight</span>
											<span className="text-sm font-bold text-gray-900">{health.lastCheckup.weight || "-"}</span>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
											<ShieldCheck size={14} className={health.lastCheckup.healthStatus === "Healthy" ? "text-green-500" : "text-gray-400"} />
										</div>
										<div className="flex flex-col">
											<span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Health Status</span>
											{health.lastCheckup.healthStatus === "Healthy" ? (
												<span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-0.5 w-fit">
													Healthy
												</span>
											) : (
												<span className="text-sm font-bold text-gray-900">{health.lastCheckup.healthStatus || "-"}</span>
											)}
										</div>
									</div>
								</div>

								<button
									type="button"
									onClick={() => { setTempCheckup(health.lastCheckup); setIsEditingCheckup(true); }}
									className="w-full mt-6 py-3.5 border-2 border-dashed border-teal-200 text-teal-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-50 transition-colors text-sm"
								>
									<Pencil size={16} /> Update Checkup
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

/* ================================================================
   FULL SCREEN — mobile / tablet view
   ================================================================ */
export default function HealthReportStep() {
	const { currentStep, goNext, goBack, isFirstStep, isLastStep, canProceed } = useRegisterCat();

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<StepHeader stepIndex={currentStep} onBack={goBack} />

			<div className="flex-1 bg-white -mt-6 rounded-t-[40px] px-5 pt-8 pb-32 sm:px-8 shadow-sm relative z-20">
				<div className="max-w-2xl mx-auto space-y-6">
					<StepProgressBar stepIndex={currentStep} />
					<HealthReportFields />
				</div>
			</div>

			<StepNavButtons
				onBack={goBack}
				onNext={goNext}
				isFirstStep={isFirstStep}
				isLastStep={isLastStep}
				canProceed={canProceed}
			/>
		</div>
	);
}

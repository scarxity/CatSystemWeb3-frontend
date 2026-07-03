"use client";

import {
	Globe,
	Mail,
	MapPin,
	Phone,
	Building2,
	User,
	CloudUpload,
	ShieldCheck,
	CreditCard,
	Building,
	Heart,
	Cat,
} from "lucide-react";
import { useRef, useCallback } from "react";
import { useRegisterCat } from "../context/RegisterCatContext";
import StepHeader from "../components/StepHeader";
import StepNavButtons from "../components/StepNavButtons";
import StepProgressBar from "../components/StepProgressBar";

/* ================================================================
   FIELDS ONLY — used by the desktop layout panel
   ================================================================ */
const InputField = ({ label, icon, value, onChange, placeholder, type = "text", required = true }: {
	label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder: string; type?: string; required?: boolean;
}) => (
	<div className="space-y-1.5">
		<label className="text-sm font-bold text-gray-900 block">{label} {required && <span className="text-red-500">*</span>}</label>
		<div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 focus-within:bg-white transition-all">
			<span className="text-gray-400 shrink-0">{icon}</span>
			<input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-medium outline-none bg-transparent" />
		</div>
	</div>
);

export function OwnerDataFields() {
	const { formData, updateOwnerData } = useRegisterCat();
	const owner = formData.ownerData;
	const certInputRef = useRef<HTMLInputElement>(null);
	const docInputRef = useRef<HTMLInputElement>(null);

	const handleCertUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]; if (!file) return;
		updateOwnerData({ breederRegistration: { ...owner.breederRegistration, certificate: file } });
	}, [owner.breederRegistration, updateOwnerData]);

	const handleDocUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]; if (!file) return;
		updateOwnerData({ ownershipProof: { ...owner.ownershipProof, document: file } });
	}, [owner.ownershipProof, updateOwnerData]);

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-6">
			{/* Section 1: Basic Information */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
						<User size={16} className="text-blue-600" />
					</div>
					<h3 className="text-base font-extrabold text-gray-900">Basic Information</h3>
				</div>

				<InputField label="Owner Name" icon={<User size={18} />} value={owner.ownerName} onChange={(v) => updateOwnerData({ ownerName: v })} placeholder="Enter owner full name" />
				<InputField label="Email Address" icon={<Mail size={18} />} value={owner.email} onChange={(v) => updateOwnerData({ email: v })} placeholder="Enter email address" type="email" />
				
				<div className="space-y-1.5">
					<label className="text-sm font-bold text-gray-900 block">Phone Number <span className="text-red-500">*</span></label>
					<div className="flex gap-2 min-w-0">
					<select
						value={owner.countryCode}
						onChange={(e) => updateOwnerData({ countryCode: e.target.value })}
						className="w-[86px] flex-shrink-0 px-2 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#4359ea]/20 focus:border-[#4359ea] focus:bg-white transition-all cursor-pointer"
					>
						<option value="+1">🇺🇸 +1</option>
						<option value="+44">🇬🇧 +44</option>
						<option value="+62">🇮🇩 +62</option>
					</select>
					<div className="flex-1 min-w-0 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 focus-within:bg-white transition-all">
						<Phone size={16} className="text-gray-400 shrink-0" />
						<input
							type="tel"
							value={owner.phone}
							onChange={(e) => updateOwnerData({ phone: e.target.value })}
							placeholder="Phone number"
							className="flex-1 min-w-0 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-medium outline-none bg-transparent"
						/>
					</div>
				</div>
				</div>

				<div className="space-y-1.5">
					<label className="text-sm font-bold text-gray-900 block">Country <span className="text-red-500">*</span></label>
					<div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 focus-within:bg-white transition-all">
						<Globe size={18} className="text-gray-400 shrink-0" />
						<select value={owner.country} onChange={(e) => updateOwnerData({ country: e.target.value })} className="flex-1 text-sm font-semibold text-gray-900 bg-transparent outline-none cursor-pointer appearance-none">
							<option value="" disabled className="text-gray-400 font-medium">Select country</option>
							<option value="United States">United States</option>
							<option value="United Kingdom">United Kingdom</option>
							<option value="Indonesia">Indonesia</option>
						</select>
					</div>
				</div>

				<InputField label="City / Province" icon={<Building2 size={18} />} value={owner.city} onChange={(v) => updateOwnerData({ city: v })} placeholder="Enter city or province" />

				<div className="space-y-1.5">
					<label className="text-sm font-bold text-gray-900 block">Address <span className="text-red-500">*</span></label>
					<div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 focus-within:bg-white transition-all">
						<MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
						<textarea value={owner.address} onChange={(e) => updateOwnerData({ address: e.target.value })} placeholder="Enter complete address" rows={3} className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-medium outline-none bg-transparent resize-none" />
					</div>
				</div>
			</div>

			<div className="h-px bg-gray-100" />

			{/* Section 2: Owner Type */}
			<div className="space-y-4">
				<label className="text-sm font-bold text-gray-900 block">Owner Type <span className="text-red-500">*</span></label>
				<div className="grid grid-cols-1 gap-3">
					<button
						type="button"
						onClick={() => updateOwnerData({ ownerType: "Individual Cat Lover" })}
						className={`flex items-center p-4 border-2 rounded-2xl transition-all text-left ${owner.ownerType === "Individual Cat Lover" ? "border-[#4359ea] bg-[#4359ea]/5" : "border-gray-100 bg-white hover:border-gray-200"}`}
					>
						<div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mr-4 ${owner.ownerType === "Individual Cat Lover" ? "bg-[#4359ea] text-white" : "bg-gray-50 text-gray-400"}`}>
							<Heart size={24} />
						</div>
						<div className="flex-1">
							<h4 className={`text-base font-bold ${owner.ownerType === "Individual Cat Lover" ? "text-[#4359ea]" : "text-gray-900"}`}>Individual Cat Lover</h4>
							<p className="text-xs text-gray-500 font-medium mt-0.5">Pet owner without commercial breeding purposes.</p>
						</div>
						<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${owner.ownerType === "Individual Cat Lover" ? "border-[#4359ea]" : "border-gray-300"}`}>
							{owner.ownerType === "Individual Cat Lover" && <div className="w-2.5 h-2.5 bg-[#4359ea] rounded-full" />}
						</div>
					</button>

					<button
						type="button"
						onClick={() => updateOwnerData({ ownerType: "Individual Breeder" })}
						className={`flex items-center p-4 border-2 rounded-2xl transition-all text-left ${owner.ownerType === "Individual Breeder" ? "border-[#4359ea] bg-[#4359ea]/5" : "border-gray-100 bg-white hover:border-gray-200"}`}
					>
						<div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mr-4 ${owner.ownerType === "Individual Breeder" ? "bg-[#4359ea] text-white" : "bg-gray-50 text-gray-400"}`}>
							<Cat size={24} />
						</div>
						<div className="flex-1">
							<h4 className={`text-base font-bold ${owner.ownerType === "Individual Breeder" ? "text-[#4359ea]" : "text-gray-900"}`}>Individual Breeder</h4>
							<p className="text-xs text-gray-500 font-medium mt-0.5">Professional breeder with registration documents.</p>
						</div>
						<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${owner.ownerType === "Individual Breeder" ? "border-[#4359ea]" : "border-gray-300"}`}>
							{owner.ownerType === "Individual Breeder" && <div className="w-2.5 h-2.5 bg-[#4359ea] rounded-full" />}
						</div>
					</button>
				</div>
			</div>

			{/* Breeder Registration Details */}
			{owner.ownerType === "Individual Breeder" && (
				<div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 space-y-4">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
							<ShieldCheck size={16} className="text-purple-600" />
						</div>
						<h3 className="text-sm font-extrabold text-purple-900">Breeder Registration Details</h3>
					</div>

					<div className="space-y-4">
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-purple-800 uppercase tracking-wider block">Registration Number <span className="text-red-500">*</span></label>
							<div className="flex items-center gap-3 bg-white border border-purple-100 rounded-xl px-4 py-3 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 transition-all">
								<CreditCard size={18} className="text-purple-300 shrink-0" />
								<input type="text" value={owner.breederRegistration.registrationNumber} onChange={(e) => updateOwnerData({ breederRegistration: { ...owner.breederRegistration, registrationNumber: e.target.value } })} placeholder="Enter registration number" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-medium outline-none bg-transparent" />
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-bold text-purple-800 uppercase tracking-wider block">Organization / Authority <span className="text-red-500">*</span></label>
							<div className="flex items-center gap-3 bg-white border border-purple-100 rounded-xl px-4 py-3 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 transition-all">
								<Building size={18} className="text-purple-300 shrink-0" />
								<input type="text" value={owner.breederRegistration.organization} onChange={(e) => updateOwnerData({ breederRegistration: { ...owner.breederRegistration, organization: e.target.value } })} placeholder="Enter organization name" className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-medium outline-none bg-transparent" />
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-bold text-purple-800 uppercase tracking-wider block">Registration Status <span className="text-red-500">*</span></label>
							<div className="flex items-center gap-3 bg-white border border-purple-100 rounded-xl px-4 py-3 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 transition-all">
								<select value={owner.breederRegistration.status} onChange={(e) => updateOwnerData({ breederRegistration: { ...owner.breederRegistration, status: e.target.value } })} className="flex-1 text-sm font-semibold text-gray-900 bg-transparent outline-none cursor-pointer appearance-none">
									<option value="" disabled className="text-gray-400 font-medium">Select status</option>
									<option value="Active">Active</option>
									<option value="Pending">Pending</option>
									<option value="Expired">Expired</option>
								</select>
							</div>
						</div>

						<div className="space-y-1.5 pt-2">
							<label className="text-xs font-bold text-purple-800 uppercase tracking-wider block">Registration Certificate <span className="text-red-500">*</span></label>
							<div 
								onClick={() => certInputRef.current?.click()}
								className="border-2 border-dashed border-purple-200 bg-white hover:bg-purple-50/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
							>
								<div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3">
									<CloudUpload size={24} className="text-purple-500" />
								</div>
								<span className="text-sm font-bold text-purple-900 block mb-1">
									{owner.breederRegistration.certificate ? owner.breederRegistration.certificate.name : "Upload certificate"}
								</span>
								<span className="text-xs text-purple-400 font-medium">PDF, JPG, PNG (Max 5MB)</span>
								<input ref={certInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleCertUpload} />
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Ownership Proof */}
			<div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
						<ShieldCheck size={16} className="text-blue-600" />
					</div>
					<h3 className="text-sm font-extrabold text-blue-900">Ownership Proof</h3>
				</div>

				<div className="space-y-4">
					<div className="space-y-1.5">
						<label className="text-xs font-bold text-blue-800 uppercase tracking-wider block">Document Type <span className="text-red-500">*</span></label>
						<div className="flex items-center gap-3 bg-white border border-blue-100 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all">
							<select value={owner.ownershipProof.documentType} onChange={(e) => updateOwnerData({ ownershipProof: { ...owner.ownershipProof, documentType: e.target.value } })} className="flex-1 text-sm font-semibold text-gray-900 bg-transparent outline-none cursor-pointer appearance-none">
								<option value="" disabled className="text-gray-400 font-medium">Select document type</option>
								<option value="Purchase Receipt">Purchase Receipt</option>
								<option value="Adoption Certificate">Adoption Certificate</option>
								<option value="Breeder Contract">Breeder Contract</option>
							</select>
						</div>
					</div>

					<div className="space-y-1.5 pt-2">
						<label className="text-xs font-bold text-blue-800 uppercase tracking-wider block">Upload Document <span className="text-red-500">*</span></label>
						<div 
							onClick={() => docInputRef.current?.click()}
							className="border-2 border-dashed border-blue-200 bg-white hover:bg-blue-50/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
						>
							<div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
								<CloudUpload size={24} className="text-blue-500" />
							</div>
							<span className="text-sm font-bold text-blue-900 block mb-1">
								{owner.ownershipProof.document ? owner.ownershipProof.document.name : "Upload document"}
							</span>
							<span className="text-xs text-blue-400 font-medium">PDF, JPG, PNG (Max 5MB)</span>
							<input ref={docInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleDocUpload} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ================================================================
   FULL SCREEN — mobile / tablet view
   ================================================================ */
export default function OwnerDataStep() {
	const {
		currentStep,
		goNext,
		goBack,
		isFirstStep,
		isLastStep,
		canProceed,
	} = useRegisterCat();

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<StepHeader stepIndex={currentStep} onBack={goBack} />

			<div className="flex-1 bg-white -mt-6 rounded-t-[40px] px-5 pt-8 pb-32 sm:px-8 shadow-sm relative z-20">
				<div className="max-w-2xl mx-auto space-y-6">
					<StepProgressBar stepIndex={currentStep} />
					<OwnerDataFields />
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

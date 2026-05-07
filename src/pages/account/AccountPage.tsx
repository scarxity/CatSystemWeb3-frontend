import React from "react";
import {
	Pencil,
	Cat,
	Heart,
	Settings,
	ShieldCheck,
	Wallet,
	Info,
	LogOut,
	ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

interface MenuItemProps {
	icon: React.ReactNode;
	title: string;
	subtitle?: string | React.ReactNode;
	rightContent?: React.ReactNode;
	href?: string;
	showChevron?: boolean;
	iconBgColor: string;
	iconColor: string;
	isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
	icon,
	title,
	subtitle,
	rightContent,
	href = "#",
	showChevron = true,
	iconBgColor,
	iconColor,
	isLast = false,
}) => {
	const content = (
		<div className="flex items-center p-4">
			{/* Icon Container */}
			<div
				className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}
			>
				{icon}
			</div>

			{/* Text Content */}
			<div className="ml-4 flex-1">
				<h3 className="text-[17px] font-semibold text-gray-900">{title}</h3>
				{subtitle && <div className="text-[14px] text-gray-500 mt-0.5">{subtitle}</div>}
			</div>

			{/* Right Content / Chevron */}
			<div className="flex items-center text-gray-400">
				{rightContent && <span className="mr-2 text-sm text-blue-600 font-medium">{rightContent}</span>}
				{showChevron && <ChevronRight className="w-5 h-5 text-gray-400" />}
			</div>
		</div>
	);

	return (
		<Link href={href} className="block hover:bg-gray-50/50 transition-colors">
			{content}
			{!isLast && <div className="mx-4 border-b border-gray-100" />}
		</Link>
	);
};

export default function AccountPage() {
	const router = useRouter();
	const { logout } = usePrivy();

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	};

	return (
		<div className="min-h-screen bg-[#f8f9fc] pb-8 pt-4 md:pt-10 px-4 sm:px-6 flex justify-center">
			<div className="w-full max-w-[480px] md:max-w-4xl lg:max-w-5xl space-y-4 md:space-y-6">
				{/* Header / Title - optional, usually iOS apps have a title bar, but we'll follow image exactly */}

				{/* 1. Profile Section */}
				<div className="bg-white rounded-[24px] p-4 md:p-8 flex flex-col sm:flex-row items-center shadow-sm border border-gray-100 transition-all hover:shadow-md">
					<div className="flex items-center w-full">
						<div className="relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden shrink-0 bg-blue-100 ring-4 ring-white shadow-sm">
							<Image
								src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop"
								alt="Profile"
								fill
								className="object-cover"
								unoptimized
							/>
						</div>
						<div className="ml-4 md:ml-6 flex-1">
							<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Alex Morgan</h2>
							<p className="text-gray-500 text-[15px] md:text-base mt-1">@alexmorgan</p>
						</div>
						<div className="hidden sm:block">
							<button type="button" className="flex items-center px-5 py-2.5 border border-gray-200 rounded-xl text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors shadow-sm">
								<Pencil className="w-4 h-4 mr-2" />
								Edit Profile
							</button>
						</div>
					</div>
					{/* Mobile Edit Button */}
					<div className="w-full mt-4 sm:hidden flex justify-end">
						<button type="button" className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors">
							<Pencil className="w-4 h-4 mr-2" />
							Edit Profile
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
					{/* 2. My Cats & Favorites */}
					<div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
						<MenuItem
							icon={<Cat className="w-6 h-6" strokeWidth={1.5} />}
							title="My Cats"
							subtitle="1 cat registered"
							rightContent="View My Cats"
							iconBgColor="bg-blue-50"
							iconColor="text-blue-500"
						/>
						<MenuItem
							icon={<Heart className="w-6 h-6" strokeWidth={1.5} />}
							title="My Favorites"
							subtitle="5 cats saved"
							rightContent="View Favorites"
							iconBgColor="bg-rose-50"
							iconColor="text-rose-500"
							isLast
						/>
					</div>

					{/* 3. Settings & Security */}
					<div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
						<MenuItem
							icon={<Settings className="w-6 h-6" strokeWidth={1.5} />}
							title="Settings"
							subtitle="Notifications, Privacy, Language"
							iconBgColor="bg-purple-50"
							iconColor="text-purple-500"
						/>
						<MenuItem
							icon={<ShieldCheck className="w-6 h-6" strokeWidth={1.5} />}
							title="Security"
							subtitle="Change Password, Two-Factor Auth"
							iconBgColor="bg-emerald-50"
							iconColor="text-emerald-600"
							isLast
						/>
					</div>

					{/* 4. Wallet */}
					<div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
						<MenuItem
							icon={<Wallet className="w-6 h-6" strokeWidth={1.5} />}
							title="Wallet"
							subtitle={
								<div className="flex flex-col mt-0.5 space-y-0.5">
									<span className="text-gray-500">Connected: 0x7f3a...</span>
									<span className="text-gray-500">
										Balance: <span className="text-emerald-500 font-medium">5.25 ETH</span>
									</span>
								</div>
							}
							iconBgColor="bg-blue-50"
							iconColor="text-blue-600"
							isLast
						/>
					</div>

					{/* 5. About & Help */}
					<div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
						<MenuItem
							icon={<Info className="w-6 h-6" strokeWidth={1.5} />}
							title="About & Help"
							subtitle="Help & FAQ, Terms, Privacy Policy"
							iconBgColor="bg-amber-50"
							iconColor="text-amber-600"
							isLast
						/>
					</div>
				</div>

				{/* 6. Logout */}
				<div className="flex md:justify-end pt-2 md:pt-4">
					<div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden w-full md:w-auto md:min-w-[200px] transition-all hover:shadow-md hover:border-red-100">
						<button
							type="button"
							onClick={handleLogout}
							className="w-full flex items-center justify-center p-4 hover:bg-red-50/50 transition-colors group"
						>
							<LogOut className="w-5 h-5 text-red-500 mr-2 group-hover:scale-110 transition-transform" strokeWidth={2} />
							<span className="text-[17px] font-semibold text-red-500">Logout</span>
						</button>
					</div>
				</div>
				
				{/* Bottom spacing to ensure it doesn't get covered by the bottom nav */}
				<div className="h-6 md:h-12" />
			</div>
		</div>
	);
}

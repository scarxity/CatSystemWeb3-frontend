import React, { useState } from "react";
import { Link as LinkIcon, Info } from "lucide-react";

type NotificationCategory = "marketplace" | "messages" | "system";

interface Notification {
	id: string;
	category: NotificationCategory;
	title: string;
	time: string;
	isNew: boolean;
	iconType: "confetti" | "message" | "check" | "link" | "info";
}

const NOTIFICATIONS: Notification[] = [
	{
		id: "1",
		category: "marketplace",
		title: "John Breeder is interested in your cat Luna",
		time: "2 hours ago",
		isNew: true,
		iconType: "confetti",
	},
	{
		id: "2",
		category: "messages",
		title: "Sarah sent you a message",
		time: "1 hour ago",
		isNew: true,
		iconType: "message",
	},
	{
		id: "3",
		category: "system",
		title: "Your cat Luna's DNA was verified on blockchain",
		time: "5 hours ago",
		isNew: false,
		iconType: "check",
	},
	{
		id: "4",
		category: "marketplace",
		title: "New marketplace listing:\nMaine Coon - 0.75 ETH",
		time: "1 day ago",
		isNew: false,
		iconType: "link",
	},
	{
		id: "5",
		category: "system",
		title: "System maintenance notice",
		time: "2 days ago",
		isNew: false,
		iconType: "info",
	},
];

const TABS = ["All", "Unread", "Marketplace", "Messages", "System"];

export default function NotificationsPage() {
	const [activeTab, setActiveTab] = useState("All");

	const filteredNotifications = NOTIFICATIONS.filter((n) => {
		if (activeTab === "All") return true;
		if (activeTab === "Unread") return n.isNew;
		return n.category.toLowerCase() === activeTab.toLowerCase();
	});

	const getIcon = (type: Notification["iconType"]) => {
		switch (type) {
			case "confetti":
				return <span className="text-[28px] leading-none">🎉</span>;
			case "message":
				return (
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1C64F2]">
						<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
						<path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/>
					</svg>
				);
			case "check":
				return (
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#059669]">
						<circle cx="12" cy="12" r="10"/>
						<path d="m9 12 2 2 4-4"/>
					</svg>
				);
			case "link":
				return <LinkIcon className="w-6 h-6 text-[#7E22CE]" strokeWidth={2} />;
			case "info":
				return <Info className="w-6 h-6 text-[#1C64F2]" strokeWidth={2} />;
		}
	};

	const getIconBg = (type: Notification["iconType"]) => {
		switch (type) {
			case "confetti":
				return "bg-[#F5F3FF]";
			case "message":
				return "bg-[#EFF6FF]";
			case "check":
				return "bg-[#F0FDF4]";
			case "link":
				return "bg-[#FAF5FF]";
			case "info":
				return "bg-[#EFF6FF]";
		}
	};

	return (
		<div className="min-h-screen bg-white pb-24 pt-10 md:pt-16 px-4 sm:px-6 lg:px-8 flex justify-center">
			<div className="w-full max-w-[500px] md:max-w-2xl lg:max-w-4xl space-y-6 md:space-y-8">
				
				{/* Header */}
				<h1 className="text-[34px] md:text-[42px] font-bold text-[#0F172A] tracking-tight">
					Notifications
				</h1>

				{/* Tabs */}
				<div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 md:flex-wrap">
					{TABS.map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`whitespace-nowrap px-5 py-2 md:px-6 md:py-2.5 text-[15px] md:text-[16px] font-medium rounded-xl transition-all ${
								activeTab === tab
									? "bg-[#1C64F2] text-white shadow-sm"
									: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* Notifications List */}
				<div className="space-y-4 md:space-y-5">
					{filteredNotifications.map((notification) => (
						<div 
							key={notification.id} 
							className="bg-white rounded-[16px] md:rounded-[20px] p-4 md:p-6 flex gap-4 md:gap-6 items-center border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow"
						>
							{/* Icon */}
							<div className={`w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center shrink-0 ${getIconBg(notification.iconType)}`}>
								<div className="scale-100 md:scale-110 flex items-center justify-center">
									{getIcon(notification.iconType)}
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1.5 md:mb-2">
									{notification.isNew && (
										<span className="bg-[#F3E8FF] text-[#7E22CE] text-[10px] md:text-[11px] font-bold px-1.5 md:px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
											NEW
										</span>
									)}
									{notification.isNew && <span className="text-gray-400 text-[10px] md:text-[12px]">&bull;</span>}
									<span className="text-gray-500 text-[13px] md:text-[14px]">{notification.time}</span>
								</div>
								<h4 className="text-[15px] md:text-[17px] text-[#0F172A] font-medium leading-[1.4] whitespace-pre-line pr-2 md:pr-4">
									{notification.title}
								</h4>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col md:flex-row gap-2.5 md:gap-3 shrink-0 ml-1 md:ml-4">
								<button className="w-[88px] md:w-[100px] py-[7px] md:py-2 bg-[#1C64F2] text-white text-[14px] md:text-[15px] font-medium rounded-[8px] md:rounded-[10px] hover:bg-blue-700 transition-colors shadow-sm">
									View
								</button>
								<button className="w-[88px] md:w-[100px] py-[7px] md:py-2 bg-white border border-gray-200 text-gray-700 text-[14px] md:text-[15px] font-medium rounded-[8px] md:rounded-[10px] hover:bg-gray-50 transition-colors shadow-sm">
									Dismiss
								</button>
							</div>
						</div>
					))}
					
					{filteredNotifications.length === 0 && (
						<div className="text-center py-12 md:py-20 text-gray-500 md:text-[17px]">
							No notifications found.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

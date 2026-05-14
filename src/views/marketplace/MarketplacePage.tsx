import React, { useState } from "react";
import { Search, SlidersHorizontal, Heart, Check } from "lucide-react";
import Image from "next/image";

type MarketCat = {
	id: string;
	name: string;
	breed: string;
	price: string;
	usdPrice: string;
	currency: string;
	age: string;
	imageUrl: string;
	isLiked: boolean;
	verified: boolean;
};

const MOCK_MARKET_CATS: MarketCat[] = [
	{
		id: "1",
		name: "Luna",
		breed: "Maine Coon",
		price: "0.85",
		usdPrice: "1,587",
		currency: "ETH",
		age: "6 months",
		imageUrl: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?q=80&w=400&auto=format&fit=crop",
		isLiked: false,
		verified: true,
	},
	{
		id: "2",
		name: "Milo",
		breed: "Ragdoll",
		price: "0.72",
		usdPrice: "1,343",
		currency: "ETH",
		age: "8 months",
		imageUrl: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=400&auto=format&fit=crop",
		isLiked: false,
		verified: true,
	},
	{
		id: "3",
		name: "Leo",
		breed: "Bengal",
		price: "0.65",
		usdPrice: "1,213",
		currency: "ETH",
		age: "5 months",
		imageUrl: "https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=400&auto=format&fit=crop",
		isLiked: false,
		verified: true,
	},
	{
		id: "4",
		name: "Suki",
		breed: "Siamese",
		price: "0.58",
		usdPrice: "1,081",
		currency: "ETH",
		age: "4 months",
		imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=400&auto=format&fit=crop",
		isLiked: false,
		verified: true,
	},
	{
		id: "5",
		name: "Oliver",
		breed: "British Shorthair",
		price: "0.45",
		usdPrice: "840",
		currency: "ETH",
		age: "12 months",
		imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop",
		isLiked: true,
		verified: true,
	},
	{
		id: "6",
		name: "Bella",
		breed: "Persian",
		price: "0.30",
		usdPrice: "560",
		currency: "ETH",
		age: "10 months",
		imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=400&auto=format&fit=crop",
		isLiked: false,
		verified: true,
	},
];

export default function MarketplacePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [marketCats, setMarketCats] = useState(MOCK_MARKET_CATS);

	const filteredCats = marketCats.filter((cat) => {
		const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
						      cat.breed.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch;
	});

	const toggleLike = (id: string) => {
		setMarketCats(prev => prev.map(cat => 
			cat.id === id ? { ...cat, isLiked: !cat.isLiked } : cat
		));
	};

	return (
		<div className="min-h-screen bg-white pb-24 pt-4 md:pt-12 px-4 sm:px-6 lg:px-8 flex justify-center">
			<div className="w-full max-w-[500px] md:max-w-4xl lg:max-w-6xl space-y-6">
				
				{/* Header Section */}
				<div className="flex items-center justify-between">
					<h1 className="text-[28px] md:text-[34px] font-bold text-[#0A0B1A]">
						Marketplace
					</h1>
					<button className="p-2.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors">
						<SlidersHorizontal size={20} className="text-gray-900" />
					</button>
				</div>

				{/* Search Input */}
				<div className="relative group w-full">
					<div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
						<Search size={20} />
					</div>
					<input
						type="text"
						placeholder="Search cats..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium text-sm"
					/>
				</div>

				{/* Cat Grid - 2 columns on mobile */}
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
					{filteredCats.map((cat) => (
						<div 
							key={cat.id}
							className="group bg-white flex flex-col"
						>
							{/* Image Container */}
							<div className="relative aspect-square md:aspect-[4/3] rounded-[20px] overflow-hidden shadow-sm">
								<Image
									src={cat.imageUrl}
									alt={cat.name}
									fill
									className="object-cover"
								/>
								
								{/* Verified Badge */}
								{cat.verified && (
									<div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
										<div className="w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center">
											<Check size={10} className="text-white" strokeWidth={4} />
										</div>
										<span className="text-[10px] font-bold text-gray-700">Verified</span>
									</div>
								)}

								{/* Heart Button */}
								<button 
									onClick={() => toggleLike(cat.id)}
									className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-400 hover:text-rose-500 transition-all shadow-sm active:scale-90"
								>
									<Heart size={18} fill={cat.isLiked ? "#F43F5E" : "none"} className={cat.isLiked ? "text-rose-500" : ""} />
								</button>
							</div>

							{/* Info Container */}
							<div className="py-3 px-1 space-y-1">
								<div className="flex justify-between items-start">
									<h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
										{cat.name}
									</h3>
									<div className="text-right">
										<p className="text-sm md:text-base font-bold text-indigo-600">
											{cat.price} {cat.currency}
										</p>
									</div>
								</div>

								<div className="flex justify-between items-start">
									<p className="text-[13px] md:text-sm text-gray-400 font-medium">
										{cat.breed}
									</p>
									<p className="text-[11px] md:text-xs text-gray-300 font-medium">
										≈ ${cat.usdPrice}
									</p>
								</div>

								<p className="text-[11px] md:text-xs text-gray-400 font-medium">
									{cat.age}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{filteredCats.length === 0 && (
					<div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
						<div className="p-4 bg-gray-50 rounded-full text-gray-300">
							<Search size={32} />
						</div>
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-gray-900">No cats found</h3>
							<p className="text-sm text-gray-500">
								Try adjusting your search query.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
export {};

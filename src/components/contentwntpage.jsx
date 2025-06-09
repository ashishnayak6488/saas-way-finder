"use client";
import { Film, FileText, Image, Edit2, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/Button";

const Content = () => {
    const contentList = [
        { id: 1, name: "Marketing Video", type: "Video", date: "2023-01-15" },
        { id: 2, name: "Product Guide", type: "PDF", date: "2023-02-01" },
        { id: 3, name: "Company Profile", type: "Image", date: "2023-03-10" },
    ];

    const getIcon = (type) => {
        switch (type) {
            case "Video": return <Film className="w-5 h-5" />;
            case "PDF": return <FileText className="w-5 h-5" />;
            case "Image": return <Image className="w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <main className="flex-1 p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Content Management</h1>

                        <Button variant="primary" size="lg" className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Content
                        </Button>

                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="p-3 text-left">#</th>
                                    <th className="p-3 text-left">Name</th>
                                    <th className="p-3 text-left">Type</th>
                                    <th className="p-3 text-left">Date Added</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contentList.map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white hover:bg-gray-50"
                                    >
                                        <td className="p-3">{item.id}</td>
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                {getIcon(item.type)}
                                                {item.type}
                                            </div>
                                        </td>
                                        <td className="p-3">{item.date}</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Content;

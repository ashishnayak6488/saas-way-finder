'use client';
import { motion, useMotionValue, useTransform, animate, MotionValue } from "framer-motion";
import { useEffect, useState, useCallback, useRef, JSX } from 'react';
import {
    Monitor,
    FileText,
    Tv,
    PlaySquare,
    HelpCircle,
    Group, 
    Image
} from 'lucide-react';

// TypeScript interfaces
interface Screen {
    id: string;
    name: string;
    status: 'online' | 'offline';
    location?: string;
}

interface Content {
    id: string;
    name: string;
    type: string;
    createdAt: string;
}

interface Playlist {
    id: string;
    name: string;
    contentCount: number;
}

interface GroupData {
    id: string;
    name: string;
    screenCount: number;
}

interface StatItem {
    title: string;
    value: number;
    icon: JSX.Element;
    description: string;
}

interface PulsingDotStyles {
    online: string;
    offline: string;
    pulse: {
        animation: string;
    };
}

interface AnimatedCounterProps {
    value: number;
}

const DashboardContent: React.FC = () => {
    const [screens, setScreens] = useState<Screen[]>([]);
    const [screensOnline, setScreensOnline] = useState<number>(0);
    const [contents, setContents] = useState<Content[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [groups, setGroups] = useState<GroupData[]>([]);

    // Commented out API calls as in original
    // const fetchScreens = useCallback(async (): Promise<any> => {
    //     const response = await fetch(`/api/screen/getAllScreen?limit=100&offset=0`, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         credentials: 'include',
    //     });
    //     const data = await response.json();
    //     if (response.ok && data.screens) {
    //         setScreens(data.screens);
    //     }
    //     return data;
    // }, []);

    const pulsingDot: PulsingDotStyles = {
        online: "relative flex h-3 w-3 mr-2",
        offline: "relative flex h-3 w-3 mr-2",
        pulse: {
            animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"
        }
    };

    const stats: StatItem[] = [
        { 
            title: 'Number of Screens', 
            value: screens.length, 
            icon: <Monitor />, 
            description: 'Screens deployed globally.' 
        },
        { 
            title: 'Number of Contents', 
            value: contents.length, 
            icon: <Image />, 
            description: 'Content pieces created this year.' 
        },
        {
            title: 'Online Screens',
            value: screensOnline,
            icon: (
                <div className="flex items-center">
                    <div className={pulsingDot.online}>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                    <Tv />
                </div>
            ),
            description: 'Screens currently online.'
        },
        {
            title: 'Offline Screens',
            value: screens.length - screensOnline,
            icon: (
                <div className="flex items-center">
                    <div className={pulsingDot.offline}>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400"></span>
                    </div>
                    <Tv />
                </div>
            ),
            description: 'Screens currently offline.'
        },
        { 
            title: 'Number of Playlists', 
            value: playlists.length, 
            icon: <PlaySquare />, 
            description: 'Playlists being used.' 
        },
        { 
            title: 'Number of Groups', 
            value: groups.length, 
            icon: <Group />, 
            description: 'Groups being used.' 
        },
    ];

    const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value }) => {
        const count: MotionValue<number> = useMotionValue(0);
        const rounded = useTransform(count, Math.round);

        useEffect(() => {
            const animation = animate(count, value, {
                duration: 5,
                ease: "easeOut",
            });
            return animation.stop;
        }, [count, value]);

        return <motion.span>{rounded}</motion.span>;
    };

    return (
        <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Digital Signage Dashboard</h1>
                    <p className="text-gray-500">Real-time monitoring and management</p>
                </div>
            </div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                                delay: index * 0.01,
                                type: "spring",
                                stiffness: 100,
                                damping: 10
                            }}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-blue-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <h3 className="text-2xl font-bold mt-1 text-gray-800">
                                        <AnimatedCounter value={stat.value} />
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
                                </div>
                                <motion.div
                                    className="p-3 bg-blue-50 rounded-full text-blue-500"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    {stat.icon}
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardContent;

'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Switch = React.forwardRef(({ className, checked, onChange, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            checked ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-gray-200 to-gray-300',
            className
        )}
        checked={checked}
        onCheckedChange={onChange}
        {...props}
        ref={ref}
    >
        <motion.div
            layout
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
            }}
            className={cn(
                'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0',
                'transition-transform',
                checked ? 'translate-x-5' : 'translate-x-0'
            )}
        >
            <motion.div
                initial={false}
                animate={{
                    scale: checked ? 1 : 0.8,
                    backgroundColor: checked ? '#ffffff' : '#ffffff'
                }}
                className="h-full w-full rounded-full"
            />
        </motion.div>
    </SwitchPrimitives.Root>
));

Switch.displayName = 'Switch';

export { Switch };

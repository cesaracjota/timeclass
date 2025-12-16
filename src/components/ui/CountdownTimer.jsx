import React, { useEffect, useState } from 'react';
import { Typography, Chip } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import moment from 'moment';

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [color, setColor] = useState('success');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = moment();
            const target = moment(targetDate);
            const duration = moment.duration(target.diff(now));

            if (duration.asMilliseconds() <= 0) {
                setTimeLeft('Procesando...');
                setColor('default');
                return;
            }

            const days = Math.floor(duration.asDays());
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            const parts = [];
            if (days > 0) parts.push(`${days}d`);
            if (hours > 0 || days > 0) parts.push(`${hours}h`);
            parts.push(`${minutes}m`);
            parts.push(`${seconds}s`);

            setTimeLeft(parts.join(' '));

            if (days > 1) {
                setColor('success');
            } else if (days === 1) {
                setColor('warning');
            } else {
                setColor('error');
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000); // 1 segundo

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <Chip
            icon={<AccessTime />}
            label={timeLeft}
            color={color}
            variant="filled" // Changed to filled for visibility
            sx={{
                fontSize: '0.9rem', // Bigger font
                height: 32, // Bigger height
                fontWeight: 'bold',
                px: 1
            }}
        />
    );
};

export default CountdownTimer;

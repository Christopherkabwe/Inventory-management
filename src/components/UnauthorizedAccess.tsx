import Link from 'next/link';
import DashboardLayout from './DashboardLayout';
import { ChevronLeft } from 'lucide-react';

interface Props {
    message?: string;
}

const UnauthorizedAccess: React.FC<Props> = ({ message = 'Only Admins can access this page' }) => {
    return (
        <div>
            <div className="w-full flex justify-center pt-10">
                <div className="flex flex-col w-full max-w-md rounded-lg border border-gray-500 bg-white text-center items-center justify-center p-5">
                    <h2 className="text-3xl font-bold text-red-500 p-2">
                        Unauthorized Access!
                    </h2>

                    <p className="mb-5 text-lg">{message}</p>

                    <a
                        href="/dashboard"
                        className="bg-purple-500 px-5 py-2 text-white rounded-lg border border-purple-100 
                 cursor-pointer inline-block hover:bg-purple-600"
                    >
                        Go to Home Page
                    </a>
                </div>
            </div>

        </div>
    );
};

export default UnauthorizedAccess;

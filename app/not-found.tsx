import Link from "next/link";

export default function NotFound() {
    return (
        <div className="mx-auto flex max-w-[600px] flex-col items-center px-5 py-20 text-center">
            <div className="mb-6 text-[72px]">💊</div>
            <h1 className="mb-3 font-display text-[36px] font-black text-primary">
                Page not found
            </h1>
            <p className="mb-7 text-[15px] text-[#6B7FA3]">
                The page you’re looking for doesn’t exist or has moved. Try one of the
                links below.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                <Link
                    href="/"
                    className="rounded-[12px] bg-primary px-6 py-3 text-[14px] font-bold text-white"
                >
                    Go to Home
                </Link>
                <Link
                    href="/syllabus/"
                    className="rounded-[12px] border-2 border-secondary bg-white px-6 py-3 text-[14px] font-bold text-secondary"
                >
                    Browse Syllabus
                </Link>
            </div>
        </div>
    );
}

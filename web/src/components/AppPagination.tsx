import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../components/ui/pagination"
import React from "react";

interface AppPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const AppPagination: React.FC<AppPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {

    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    }

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious size="sm" onClick={handlePrevious} />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;

                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    size="sm"
                                    onClick={() => onPageChange(page)}
                                    className={page === currentPage ? 'font-bold' : ''}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    }

                    if (page === 2 && currentPage > 3) {
                        return (
                            <PaginationItem key="start-ellipsis">
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    if (page === totalPages - 1 && currentPage < totalPages - 2) {
                        return (
                            <PaginationItem key="end-ellipsis">
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    return null;
                })}

                <PaginationItem>
                    <PaginationNext size="sm" onClick={handleNext} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default AppPagination;

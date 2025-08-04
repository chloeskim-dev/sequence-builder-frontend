export type SortDirection = "asc" | "dsc";

export function sortByField<T>(
    items: T[],
    sortBy: string,
    sortDirection: SortDirection
): T[] {
    return [...items].sort((a, b) => {
        let sortField =
            sortBy && sortBy === "duration"
                ? ("duration_secs" as keyof T) // sort by "duration_secs"
                : sortBy
                ? (sortBy as keyof T) // sort by sortBy
                : ("name" as keyof T); // default: sort by name

        const aVal = a[sortField];
        const bVal = b[sortField];

        const isAsc = sortDirection === "asc";

        // Handle nulls consistently
        const aIsNull = aVal == null;
        const bIsNull = bVal == null;
        if (aIsNull && bIsNull) return 0;
        if (aIsNull) return isAsc ? 1 : -1;
        if (bIsNull) return isAsc ? -1 : 1;

        // Handle numbers
        if (typeof aVal === "number" && typeof bVal === "number") {
            return isAsc ? aVal - bVal : bVal - aVal;
        }

        // Handle strings
        const aStr = String(aVal);
        const bStr = String(bVal);
        const result = aStr.localeCompare(bStr, undefined, {
            sensitivity: "accent",
        });
        return isAsc ? result : -result;
    });
}

export const filterBySearchQuery = (items: any, searchQuery: string) => {
    return items.filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
};

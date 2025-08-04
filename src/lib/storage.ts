import { promises as fs } from 'fs'
import path from 'path'

interface Product {
    id: string
    name: string
    amount: number
    comment?: string
    userId: string
    createdAt: string
    updatedAt: string
}

const STORAGE_FILE = path.join(process.cwd(), 'data', 'products.json')

// Ensure data directory exists
async function ensureDataDir() {
    const dataDir = path.dirname(STORAGE_FILE)
    try {
        await fs.access(dataDir)
    } catch {
        await fs.mkdir(dataDir, { recursive: true })
    }
}

// Read products from file
export async function readProducts(): Promise<Product[]> {
    try {
        await ensureDataDir()
        const data = await fs.readFile(STORAGE_FILE, 'utf-8')
        return JSON.parse(data)
    } catch {
        // File doesn't exist or is invalid, return empty array
        return []
    }
}

// Write products to file
export async function writeProducts(products: Product[]): Promise<void> {
    await ensureDataDir()
    await fs.writeFile(STORAGE_FILE, JSON.stringify(products, null, 2))
}

// Get products for a specific user
export async function getUserProducts(userId: string): Promise<Product[]> {
    const products = await readProducts()
    return products.filter(product => product.userId === userId)
}

// Add a new product
export async function addProduct(product: Product): Promise<Product> {
    const products = await readProducts()
    products.push(product)
    await writeProducts(products)
    return product
}

// Update a product
export async function updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await readProducts()
    const index = products.findIndex(p => p.id === productId)

    if (index === -1) return null

    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() }
    await writeProducts(products)
    return products[index]
}

// Delete a product
export async function deleteProduct(productId: string): Promise<boolean> {
    const products = await readProducts()
    const index = products.findIndex(p => p.id === productId)

    if (index === -1) return false

    products.splice(index, 1)
    await writeProducts(products)
    return true
}

// Reorder products
export async function reorderProducts(userId: string, productIds: string[]): Promise<boolean> {
    const products = await readProducts()
    const userProducts = products.filter(p => p.userId === userId)

    console.log('Reorder debug:', {
        userId,
        requestedProductIds: productIds,
        userProductIds: userProducts.map(p => p.id),
        userProductsCount: userProducts.length
    })

    // Verify all product IDs belong to the user
    const validProductIds = userProducts.map(p => p.id)
    const allValid = productIds.every(id => validProductIds.includes(id))

    if (!allValid) {
        console.log('Reorder validation failed:', {
            invalidIds: productIds.filter(id => !validProductIds.includes(id))
        })
        return false
    }

    // Create new order
    const reorderedProducts = productIds
        .map(id => userProducts.find(p => p.id === id))
        .filter((product): product is Product => product !== undefined)

    // Update products array
    const otherProducts = products.filter(p => p.userId !== userId)
    const newProducts = [...otherProducts, ...reorderedProducts]

    await writeProducts(newProducts)
    console.log('Reorder successful')
    return true
} 
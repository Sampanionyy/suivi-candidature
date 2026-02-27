import React from 'react'
import { useFormik } from 'formik'
import { Phone, Link } from 'lucide-react'
import type { IProfileFormValues } from '../../interfaces/types'

interface ContactLinksProps {
    formik: ReturnType<typeof useFormik<IProfileFormValues>>;
    isEditingProfile: boolean
}

const ContactLinks: React.FC<ContactLinksProps> = ({ formik, isEditingProfile }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Phone size={16} className="text-fuchsia-300" /> Contact
                </h4>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditingProfile}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <input
                            type="text"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditingProfile}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Link size={16} className="text-fuchsia-300" /> Liens professionnels
                </h4>
                {['linkedin_url', 'github_url', 'portfolio_url'].map((field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.replace('_', ' ').toUpperCase()}</label>
                        <input
                            type="url"
                            name={field}
                            value={formik.values[field as keyof typeof formik.values] || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditingProfile}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContactLinks
"use client"

import { MoreVertical, Plus, FileText, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { DocIcon } from "@/assets/svgs";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import EditingDocument from "./EditingDocument";
import Link from "next/link";
import { CreateRoom, deleteDocument, getDocuments, updateDocument } from "@/lib/actions/create-room";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useLoading } from "@/utils/LoadingContext";
import { roomStore } from "@/lib/store/roomStore";

export default function Documents() {
    const router = useRouter()
    const [type, setType] = useState("")
    const [open, setOpen] = useState(false)
    const [documentData, setDocumentData] = useState({})
    const [documents, setDocuments] = useState([])
    const [changeNameDocumentName, setChangeDocumentName] = useState("")
    const { data, isPending } = authClient.useSession()
    const { loading, setLoading } = useLoading()

    const handleCreateDocument = async () => {
        try {
            setLoading("create_document")
            const user = data.user
            const room = await CreateRoom({ userId: user.id, email: user.email })

            if (room) {
                router.push(`/document/${room.id}`)
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(null)

        }
    }

    useEffect(() => {
        if (!isPending && !data) {
            router.push("/auth/login");
            return;
        }
        const getAllDocuments = async () => {
            const docs = await getDocuments(data?.user?.email)
            setDocuments(docs.data)
        }
        if (data?.user?.id) {
            getAllDocuments()
        }
    }, [data, isPending])

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        })
    }

    const handleUpdateDelete = async () => {
        if (type === "delete") {
            setLoading("delete")
            const res = await deleteDocument({ roomId: documentData.id })
            if (res?.status === 200) {
                setDocuments((prev) => prev.filter((doc) => doc.id !== documentData.id))
            }
            setLoading(null)
            setOpen(false)
        } else if (type === "rename") {
            if (documentData.title === changeNameDocumentName) return
            setLoading("rename")

            await updateDocument(documentData.id, changeNameDocumentName)
            setDocuments((prev) => {
                return prev.map((doc) => {
                    return doc.id === documentData.id 
                        ? { ...doc, metadata: { ...doc.metadata, title: changeNameDocumentName } } 
                        : doc
                })
            })
            setDocumentData({})
            setLoading(null)
            setOpen(false)
        }
    }

    const handlePopoverClick = (e, document) => {
        
        setDocumentData({ title: document?.metadata.title, id: document.id })
        setChangeDocumentName(document.metadata.title)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <main className="pt-16 px-4 pb-8">
                <DialogContent>
                    {type === "rename" ? (
                        <DialogHeader>
                            <DialogTitle>Rename Document</DialogTitle>
                            <DialogDescription>
                                Enter the new name for document
                            </DialogDescription>
                        </DialogHeader>
                    ) : (
                        <DialogHeader>
                            <DialogTitle>Delete Document</DialogTitle>
                            <DialogDescription>
                                The "{documentData.title}" will be removed forever once you click delete
                            </DialogDescription>
                        </DialogHeader>
                    )}

                    <div className="mt-4 space-y-3">
                        {type === "rename" && (
                            <Input 
                                value={changeNameDocumentName} 
                                onChange={(e) => setChangeDocumentName(e.target.value)}
                                placeholder="Document name"
                                autoFocus
                            />
                        )}

                        <Button 
                            disabled={loading === "delete" || loading === "rename"} 
                            onClick={handleUpdateDelete} 
                            variant={type === "rename" ? "default" : "destructive"} 
                            className="w-full"
                        >
                            {loading === "rename" ? "Renaming..." : loading === "delete" ? "Deleting..." :
                                type === "rename" ? "Rename" : "Delete"}
                        </Button>
                    </div>
                </DialogContent>

                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex gap-3 justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-1">Documents</h1>
                            <p className="text-sm text-gray-3 mt-1">
                                {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                            </p>
                        </div>
                        <Button 
                        disabled={loading === "create_document"}
                            onClick={handleCreateDocument} 
                            className="flex gap-2 hover:scale-105 transition-transform"
                            size="lg"
                        >
                            <Plus className="size-5" />
                            {loading === "create_document" ? "Creating docuemnt..." :
                                 <span>New Document</span>
                                }
                           
                        </Button>
                    </div>

                    {!documents.length ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="rounded-full bg-gray-8 p-6 mb-4">
                                <FileText className="size-12 text-gray-4" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-2 mb-2">No documents yet</h3>
                            <p className="text-gray-4 mb-6">Create your first document to get started</p>
                            <Button onClick={handleCreateDocument} disabled={loading === "create_document"}>
                                <Plus className="size-4 mr-2" />
                                {loading === "create_document" ? "Creating docuemnt..." :
                                "Create Document"
                                }
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {documents.map((document) => (
                                <div
                                    key={document.id}
                                    className="group relative flex flex-col bg-gray-9 rounded-lg border border-gray-7 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                                >
                                    <Link 
                                        href={`/document/${document.id}`}
                                        className="flex-1 p-4"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="p-2 bg-gray-8 rounded-md group-hover:bg-blue-500/10 transition-colors">
                                                <DocIcon width="24px" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="font-semibold text-gray-1 truncate group-hover:text-blue-400 transition-colors">
                                                    {document?.metadata.title}
                                                </h2>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 text-xs text-gray-4">
                                            <Calendar className="size-3" />
                                            <span>{formatDate(document.createdAt)}</span>
                                        </div>
                                    </Link>

                                    <div className="absolute top-2 right-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    onClick={(e) => handlePopoverClick(e, document)}
                                                    className="rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-8 transition-all"
                                                >
                                                    <MoreVertical size={16} className="text-gray-3" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="">
                                                <EditingDocument setType={setType} setOpen={setOpen} roomId={document.id} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </Dialog>
    )
}
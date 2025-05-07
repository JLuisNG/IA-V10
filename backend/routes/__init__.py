from .create_endpoints import router as create_router
from .search_endpoints import router as search_router
from .update_endpoints import router as update_router
from .delete_endpoints import router as delete_router

__all__ = ["create_router", "search_router", "update_router", "delete_router"]